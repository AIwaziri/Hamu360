import * as React from 'react';

import { Icon } from '@components/Icon';
import { Stack } from '@components/Stack';
import type { IAnnouncement } from '@models/index';
import { classNames, formatDate } from '@utils/index';

import styles from './AnnouncementsFeed.module.scss';
import type { IAnnouncementsFeedProps } from './IAnnouncementsFeedProps';

const DISPLAY_LIMIT = 4;

/**
 * Pinned-first, then most-recent-first, capped at four — done here rather
 * than by the service (see `IAnnouncementsService`'s docblock), so the real
 * Sprint 6 service can return the live list's full row count unsorted and
 * this logic doesn't move.
 */
function selectTopAnnouncements(items: IAnnouncement[]): IAnnouncement[] {
  return [...items]
    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    })
    .slice(0, DISPLAY_LIMIT);
}

/**
 * Wireframe Card 2: "Firm announcements". Renders `title`/`author`/
 * `publishDate` only — `IAnnouncement.body` is deliberately not shown here
 * (see that model's docblock and `MockAnnouncementsService`'s): the
 * wireframe's compact hero card never displays a second line of body copy,
 * so rendering `body` here would be inventing UI the approved design
 * doesn't have. The field still exists on the model for whatever expanded
 * announcements view eventually needs it.
 *
 * No interactive elements (no links, no buttons) — matches the approved
 * wireframe exactly, which never makes an announcement row clickable. WCAG
 * "keyboard-navigable" is satisfied trivially here: a static, properly
 * ordered `<ul>` has nothing to trap or skip past.
 */
export function AnnouncementsFeed(props: IAnnouncementsFeedProps): React.ReactElement {
  const { items, className } = props;
  const topItems = selectTopAnnouncements(items);

  return (
    <div className={classNames(styles.card, className)}>
      <p className={styles.label}>
        <Icon name="speakerphone" size="sm" />
        Firm announcements
      </p>
      <Stack as="ul" direction="column" gap="sm">
        {topItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.dot} aria-hidden="true" />
            <div>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.meta}>
                {formatDate(item.publishDate)} &middot; {item.author}
              </p>
            </div>
          </li>
        ))}
      </Stack>
    </div>
  );
}
