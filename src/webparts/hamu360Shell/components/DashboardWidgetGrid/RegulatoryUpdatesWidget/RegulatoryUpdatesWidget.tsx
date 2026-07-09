import * as React from 'react';

import { EmptyState } from '@components/EmptyState';
import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import type { IRegulatoryUpdate } from '@models/index';
import { classNames, formatMonthDay } from '@utils/index';

import type { IRegulatoryUpdatesWidgetProps } from './IRegulatoryUpdatesWidgetProps';
import styles from './RegulatoryUpdatesWidget.module.scss';

const DISPLAY_LIMIT = 4;

/**
 * "Top 4, most recent first" selection lives here, not in
 * `IRegulatoryUpdatesService` — same division of responsibility as
 * `EventsWidget.selectUpcomingEvents` and Sprint 3's
 * `AnnouncementsFeed.selectTopAnnouncements`. The real "Regulatory Updates"
 * List has a "Default" view (no server-side sort configured), so this
 * component owns ordering.
 */
function selectRecentUpdates(items: IRegulatoryUpdate[]): IRegulatoryUpdate[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, DISPLAY_LIMIT);
}

/**
 * Wireframe widget 3 of 4: "Regulatory updates" (`.wt` "Regulatory updates"
 * + four `.rr` entries, each a dot + summary text + "date · practice area"
 * line).
 *
 * ## A deliberate reading of "grouped by PracticeArea"
 *
 * The Sprint 5 brief describes this widget as "grouped by PracticeArea
 * (CC/GRC/IP/DR)". The approved wireframe's own `.rr` markup, however, is a
 * flat list — there are no per-practice-area section headers anywhere in
 * the design; each row simply carries its own practice area inline, after
 * the date (`"Jun 20 · GRC"`). Rendering this as four visually grouped
 * sections would not match the approved wireframe, which is this build's
 * stated visual source of truth. This component resolves that tension by
 * treating "grouped by PracticeArea" as a description of the *data model*
 * (`IRegulatoryUpdate.practiceArea` exists and is always present, so a
 * grouped view is trivial to add later) rather than the *layout* — flagged
 * explicitly here rather than silently picking one reading, per this
 * build's "flag rather than guess" discipline.
 *
 * ## Sprint 6: empty state, no props change
 *
 * `regulatoryUpdates` can legitimately be `[]` — rendering `EmptyState` in
 * that case is an internal branch on the same `IRegulatoryUpdate[]` prop.
 */
export function RegulatoryUpdatesWidget(props: IRegulatoryUpdatesWidgetProps): React.ReactElement {
  const { regulatoryUpdates, className } = props;
  const recent = selectRecentUpdates(regulatoryUpdates);

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.title}>
        <Icon name="news" size="sm" />
        Regulatory updates
      </p>
      {recent.length === 0 ? (
        <EmptyState title="No regulatory updates" />
      ) : (
        <Stack as="ul" direction="column" gap="none">
          {recent.map((update) => (
            <li key={update.id} className={styles.row}>
              <span className={styles.dot} aria-hidden="true" />
              <div>
                <p className={styles.updateTitle}>{update.title}</p>
                <p className={styles.meta}>
                  {formatMonthDay(update.date)} &middot; {update.practiceArea}
                </p>
              </div>
            </li>
          ))}
        </Stack>
      )}
    </div>
  );
}
