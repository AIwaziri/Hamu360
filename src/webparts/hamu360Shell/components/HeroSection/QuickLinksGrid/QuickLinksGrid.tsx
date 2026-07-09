import * as React from 'react';

import { EmptyState } from '@components/EmptyState';
import { Grid } from '@components/Grid';
import { Icon } from '@components/Icon';
import type { IQuickLink } from '@models/index';
import { classNames } from '@utils/index';

import type { IQuickLinksGridProps } from './IQuickLinksGridProps';
import styles from './QuickLinksGrid.module.scss';

function sortByOrder(items: IQuickLink[]): IQuickLink[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Wireframe Card 3: "Quick links" — 8 tiles in a 2-column grid (reuses
 * Sprint 1's `Grid columns={2}`, which already stacks to a single column
 * below `tablet` — no bespoke responsive CSS needed here).
 *
 * Renders `<button>`, not `<a href={item.url}>`, even though `IQuickLink`
 * has a real `url` field from the live List's `URL` column — the mock
 * data's `url` is `'#'` (see `MockQuickLinksService`'s docblock: the real
 * values aren't documented anywhere available to this sprint), and a real
 * `<a href="#">` would both mislead assistive tech into announcing a
 * working link and scroll-to-top on click. Exactly the same reasoning
 * Sprint 2's `NavigationItem` used for its `as="button"` default. Once
 * Sprint 6 has real URLs, this is a small, contained change (swap the
 * rendered tag, keep the same props) — not a reshape of `IQuickLink` or
 * this component's API.
 *
 * **That swap is deliberately NOT made in Sprint 6**, even though real
 * `url` values now flow through `SharePointQuickLinksService`. This
 * sprint's brief explicitly says not to change any `HeroSection` component
 * "to accommodate the real data" — and while `<button>` -> `<a href>` is a
 * one-line, props-compatible change, it is still exactly the kind of
 * real-data-driven behavior change that instruction protects against
 * making without a dedicated review. Flagged here as a known, deliberate
 * follow-up rather than silently fixed or silently left unexplained.
 *
 * ## Sprint 6: empty state, no props change
 *
 * Same treatment as `AnnouncementsFeed` — `items` can legitimately be `[]`
 * from a real, possibly-empty List; that's an internal branch on the same
 * `IQuickLink[]` prop, not a signature change.
 */
export function QuickLinksGrid(props: IQuickLinksGridProps): React.ReactElement {
  const { items, className } = props;
  const sortedItems = sortByOrder(items);

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.label}>
        <Icon name="bolt" size="sm" />
        Quick links
      </p>
      {sortedItems.length === 0 ? (
        <EmptyState title="No quick links yet" />
      ) : (
        <Grid as="ul" columns={2} gap="xs">
          {sortedItems.map((item) => (
            <li key={item.id}>
              <button type="button" className={styles.tile}>
                <span className={styles.iconBox} aria-hidden="true">
                  <Icon name={item.icon} size="sm" />
                </span>
                <span className={styles.tileLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </Grid>
      )}
    </div>
  );
}
