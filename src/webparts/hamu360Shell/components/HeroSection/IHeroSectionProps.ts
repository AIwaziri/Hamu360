import type { IAnnouncement, IPartnerMessage, IQuickLink } from '@models/index';

export interface IHeroSectionProps {
  /**
   * All three datasets arrive as plain data via props — `HeroSection`
   * (and its three children) never call a service directly, per the same
   * "components take data via props only" rule `src/components/README.md`
   * already enforces. Whatever mounts `HeroSection` (today, the temporary
   * `HeroSectionShowcase`; eventually the real Home page) is the container
   * responsible for calling `createPartnerMessageService()` /
   * `createAnnouncementsService()` / `createQuickLinksService()` and
   * awaiting their results first.
   */
  partnerMessage: IPartnerMessage;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  className?: string;
}
