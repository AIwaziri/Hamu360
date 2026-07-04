import type { IQuickLink } from '@models/index';

/**
 * Returns every quick link the caller is allowed to see, unsorted — sorting
 * by `sortOrder` is `QuickLinksGrid`'s own presentation concern, not this
 * service's, for the same reason as `IAnnouncementsService`.
 */
export interface IQuickLinksService {
  getQuickLinks(): Promise<IQuickLink[]>;
}
