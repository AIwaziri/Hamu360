import type { IAnnouncement, IPartnerMessage, IQuickLink } from '@models/index';

export interface IHeroSectionProps {
  /**
   * All three datasets arrive as plain data via props — `HeroSection`
   * (and its three children) never call a service directly, per the same
   * "components take data via props only" rule `src/components/README.md`
   * already enforces. `HomePage` (via `Hamu360ShellWebPart.onInit()`) is the
   * container responsible for calling `createPartnerMessageService()` /
   * `createAnnouncementsService()` / `createQuickLinksService()` and
   * awaiting their results first.
   *
   * `partnerMessage` is `| undefined` as of the Sprint 6 closeout — "no News
   * post from the Managing Partner's account this week" is a real, expected
   * state (see `IPartnerMessageService`'s docblock), and `HeroSection`
   * itself renders `EmptyState` in place of `PartnerMessageCard` when this
   * is `undefined`. `PartnerMessageCard`'s own props are unchanged — it is
   * simply not rendered at all for this case, rather than being handed a
   * placeholder value.
   */
  partnerMessage: IPartnerMessage | undefined;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  className?: string;
}
