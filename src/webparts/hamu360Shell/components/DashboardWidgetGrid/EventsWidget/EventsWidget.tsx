import * as React from 'react';

import { EmptyState } from '@components/EmptyState';
import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import type { IEvent } from '@models/index';
import { classNames, formatEventDateParts } from '@utils/index';

import styles from './EventsWidget.module.scss';
import type { IEventsWidgetProps } from './IEventsWidgetProps';

const DISPLAY_LIMIT = 4;

/**
 * "Next 4, soonest first" selection lives here, not in `IEventsService` —
 * the exact same division of responsibility as Sprint 3's
 * `AnnouncementsFeed.selectTopAnnouncements`, so the real Sprint 6 service
 * can return the live "Events" List's full row count (it has a "Default"
 * view — no server-side date filter or sort configured, per
 * `HOS_Platform_Readiness_Gate_v1.md` §3.4) and this logic doesn't move.
 *
 * This does NOT filter out past events — with only 4 seed rows and no
 * "today" concept the mock service can supply, sorting ascending and taking
 * the first 4 is the entire contract. A real Sprint 6 query would add a
 * `StartDate ge [today]` filter server-side before this component ever sees
 * the data; that's a service-layer concern, not something to fake
 * client-side against static seed content.
 */
function selectUpcomingEvents(items: IEvent[]): IEvent[] {
  return [...items]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, DISPLAY_LIMIT);
}

/**
 * Wireframe widget 1 of 4: "Upcoming events" (`.wt` "Upcoming events" +
 * four `.ev-row` entries). Each row's date-box splits `startDate` into two
 * independently-styled lines (day number, month abbreviation) via
 * `formatEventDateParts` rather than one combined string, matching the
 * wireframe's `.ev-d`/`.ev-m` two-line layout exactly.
 *
 * `location` is rendered directly as the subtitle line — see `IEvent`'s own
 * docblock for why that field is a loose stand-in for "whatever context
 * line this event needs", not always a literal room name.
 *
 * No interactive elements — matches the wireframe, which never makes an
 * event row clickable. A static, properly ordered `<ul>` needs no extra
 * keyboard handling to be WCAG AA keyboard-navigable.
 *
 * ## Sprint 6: empty state, no props change
 *
 * `events` can legitimately be `[]` now that it comes from a real,
 * possibly-empty "Events" List — rendering `EmptyState` in that case is an
 * internal branch on the same `IEvent[]` prop, not a signature change. Loading
 * and error states live one level up (`Hamu360Shell.tsx`) — see that file's
 * docblock for why this widget's props have no room to express either.
 */
export function EventsWidget(props: IEventsWidgetProps): React.ReactElement {
  const { events, className } = props;
  const upcoming = selectUpcomingEvents(events);

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.title}>
        <Icon name="calendar" size="sm" />
        Upcoming events
      </p>
      {upcoming.length === 0 ? (
        <EmptyState title="No upcoming events" />
      ) : (
        <Stack as="ul" direction="column" gap="xs">
          {upcoming.map((event) => {
            const { day, month } = formatEventDateParts(event.startDate);
            return (
              <li key={event.id} className={styles.row}>
                {/* Not `aria-hidden` — unlike `AnnouncementsFeed`'s purely
                    decorative `.dot`, this date-box is the *only* place
                    `startDate` is rendered (there's no separate text-only date
                    line elsewhere in this row), so hiding it would remove real
                    information from screen reader users, not decoration. */}
                <span className={styles.dateBox}>
                  <span className={styles.day}>{day}</span>
                  <span className={styles.month}>{month}</span>
                </span>
                <div>
                  <p className={styles.eventTitle}>{event.title}</p>
                  <p className={styles.eventLocation}>{event.location}</p>
                </div>
              </li>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
