import type { IAnnouncement } from '@models/index';

export interface IAnnouncementsFeedProps {
  /** Every announcement the caller has (unsorted, untrimmed) — this component does the "pinned first, top 4" selection itself. See its own docblock. */
  items: IAnnouncement[];
  className?: string;
}
