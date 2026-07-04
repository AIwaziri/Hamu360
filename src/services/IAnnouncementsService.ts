import type { IAnnouncement } from '@models/index';

/**
 * Returns every announcement the caller is allowed to see, unsorted and
 * untrimmed — "top 4, pinned-first" is `AnnouncementsFeed`'s own
 * presentation concern (see that component's docblock), not this service's,
 * so the real Sprint 6 implementation can return however many rows the
 * live "Announcements" List has without the contract changing.
 */
export interface IAnnouncementsService {
  getAnnouncements(): Promise<IAnnouncement[]>;
}
