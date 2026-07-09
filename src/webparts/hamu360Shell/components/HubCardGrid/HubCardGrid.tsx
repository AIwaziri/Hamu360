import * as React from 'react';

import { Grid } from '@components/Grid';
import type { IHubTileConfig } from '@config/hubTiles';

import { HubCard } from './HubCard';
import type { IHubCardGridProps } from './IHubCardGridProps';

/**
 * The entire authorization decision for the whole Team Hub row, in one
 * function: does this tile have a `requiredGroup`, and if so, is it in the
 * caller's `userGroups`? Both arguments are plain data (a config object,
 * an array of strings) — nothing here knows or cares whether `userGroups`
 * came from `MockAudienceService` or a real Microsoft Graph
 * `/me/memberOf` call. That's the entire point: this function, and this
 * component, are already written against the *real* Sprint 6 shape, not a
 * mock-shaped stand-in for it.
 */
function isTileVisible(tile: IHubTileConfig, userGroups: string[]): boolean {
  if (!tile.requiredGroup) {
    return true;
  }
  // `Array.prototype.includes` isn't in this project's `tsconfig.json` `lib`
  // set (same ES-version ceiling as `formatDate.ts`'s `isNaN` note) —
  // `indexOf` is the ES5-safe equivalent for this one check.
  return userGroups.indexOf(tile.requiredGroup) !== -1;
}

/**
 * The Team Hub Cards row from the approved wireframe's "Team hubs — go to
 * your workspace" section. Filters `tiles` down to whatever `userGroups`
 * qualifies for, then renders whatever's left as a 5-column (mobile-first)
 * grid of `HubCard`s.
 *
 * ## Why Sprint 6 never touches this file or `HubCard`
 *
 * The MP Command Centre tile must be "genuinely absent from the DOM" for a
 * non-Managing-Partner user (per this sprint's brief) — not hidden with
 * CSS, not disabled. This component achieves that today the same way it
 * will in production: `isTileVisible` runs during the `.filter()` below,
 * and a tile that fails the check is simply never passed to `.map()` —
 * `HubCard` is never called for it, so no DOM node for it is ever created.
 * Swapping `MockAudienceService` for a real Graph-backed
 * `IAudienceService` in Sprint 6 changes what array of strings arrives in
 * `userGroups` — it changes nothing about how that array is used. The
 * `.filter(isTileVisible)` call, the `.map()` call, and every prop
 * `HubCard` receives are already written against the real shape of the
 * problem (a config object with an optional `requiredGroup`, and a
 * `string[]` of group names), not a shape convenient for a mock. There is
 * no second, "real" filtering implementation to write later — this one
 * already is the real one, just fed mock data for now.
 *
 * This also means there is nothing in this codebase resembling
 * `isManagingPartner = true` (the exact anti-pattern this sprint's brief
 * calls out): visibility is a `.filter()` over data, not a flag anyone
 * ever sets.
 *
 * ## Sprint 7: now rendered via the shared `Grid` primitive, not a hand-rolled one
 *
 * This component used to render a local `<ul className={styles.grid}>` with
 * its own hand-written `grid-template-columns` ramp, because `@components/Grid`
 * didn't support a 5-column layout yet (see `DESIGN_TOKEN_DEBT.md` entry 4,
 * now resolved). It now renders `<Grid as="ul" columns={5} gap="sm">`
 * instead — same DOM shape (a `<ul>` of `<li>`s), same visual ramp (the new
 * `columns5` step in `Grid.module.scss` was copied verbatim from the old
 * local CSS), zero behavior change. `HubCardGrid.module.scss` (and its
 * lone `.grid` class) has been deleted entirely — there is nothing local
 * left for it to hold once the column layout itself moved to the shared
 * primitive; `className` now passes straight through to `Grid`.
 */
export function HubCardGrid(props: IHubCardGridProps): React.ReactElement {
  const { tiles, userGroups, onSelectTile, className } = props;
  const visibleTiles = tiles.filter((tile) => isTileVisible(tile, userGroups));

  return (
    <Grid as="ul" columns={5} gap="sm" className={className}>
      {visibleTiles.map((tile) => (
        <li key={tile.id}>
          <HubCard
            icon={tile.icon}
            iconVariant={tile.iconVariant}
            title={tile.title}
            subtitle={tile.subtitle}
            highlighted={tile.highlighted}
            onSelect={() => onSelectTile?.(tile.id)}
          />
        </li>
      ))}
    </Grid>
  );
}
