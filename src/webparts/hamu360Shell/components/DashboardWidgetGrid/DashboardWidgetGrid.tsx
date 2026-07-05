import * as React from 'react';

import { Grid } from '@components/Grid';

import { EventsWidget } from './EventsWidget';
import { FirmWinsWidget } from './FirmWinsWidget';
import type { IDashboardWidgetGridProps } from './IDashboardWidgetGridProps';
import { NewJoinersWidget } from './NewJoinersWidget';
import { RegulatoryUpdatesWidget } from './RegulatoryUpdatesWidget';

/**
 * The wireframe's "What's happening at Hamu Legal" body section (`.four`):
 * Upcoming Events, New Joiners, Regulatory Updates, Firm Wins, in that
 * fixed order and fixed composition — this is not a generic "N widgets"
 * layout primitive, the same way `HubCardGrid` isn't a generic tile grid
 * either. The section heading itself ("What's happening at Hamu Legal") is
 * deliberately NOT rendered here, for the same reason `HubCardGrid` doesn't
 * render "Team hubs — go to your workspace": that heading belongs to
 * whatever page composes this grid (see `DashboardWidgetShowcase`), not to
 * the grid component itself.
 *
 * ## Why this is a thin wrapper around the shared `Grid`, unlike `HubCardGrid`
 *
 * `HubCardGrid` (Sprint 4) hand-rolled its own local grid CSS because the
 * wireframe's 5-column hub row needs a column count (`5`) that
 * `@components/Grid`'s `GridColumns` enum doesn't support — see
 * DESIGN_TOKEN_DEBT.md #4. This dashboard row needs exactly 4 columns, and
 * `4` *is* one of `GridColumns`'s supported values, with its own
 * mobile-first ramp already built in (`Grid.module.scss`'s `.columns4`: 1
 * col → 2 col at `tablet` → 4 col at `laptop`, using the exact same
 * `from-tablet`/`from-laptop` breakpoint mixins `HubCardGrid`'s local grid
 * uses internally). Reusing the shared `Grid` component here — rather than
 * copying `HubCardGrid`'s local-grid pattern a second time — is the more
 * faithful reading of "reuse the Sprint 4 breakpoint precedent rather than
 * inventing a new responsive pattern": the breakpoint mixins are reused
 * either way, but here they're reused through the primitive that already
 * exists for this exact column count, instead of hand-rolling a second
 * one-off grid file for a case the shared primitive already handles.
 *
 * A plain `Grid` (`as="div"`, the default) is used rather than a `<ul>` of
 * `<li>`s, unlike `HubCardGrid`. `HubCardGrid`'s five tiles are a
 * homogeneous, repeatable collection of same-shaped items — a list is the
 * correct semantic. These four widgets are four structurally different,
 * individually-headed sections (each already renders its own `<p>` title
 * and, internally, its own properly-semantic `<ul>` of same-shaped rows) —
 * wrapping four unlike things in an outer `<ul>` would not add meaningful
 * semantics, and the approved wireframe's own markup agrees (`.four` is a
 * plain `<div>`, not a list).
 */
export function DashboardWidgetGrid(props: IDashboardWidgetGridProps): React.ReactElement {
  const { events, newJoiners, regulatoryUpdates, firmWins, className } = props;

  return (
    <Grid columns={4} gap="sm" className={className}>
      <EventsWidget events={events} />
      <NewJoinersWidget newJoiners={newJoiners} />
      <RegulatoryUpdatesWidget regulatoryUpdates={regulatoryUpdates} />
      <FirmWinsWidget firmWins={firmWins} />
    </Grid>
  );
}
