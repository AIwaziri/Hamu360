import type {
  IAnnouncement,
  ICurrentUser,
  IEvent,
  IFirmWin,
  INewJoiner,
  IPartnerMessage,
  IQuickLink,
  IRegulatoryUpdate
} from '@models/index';

import type { Hamu360PageStatus, Hamu360SectionKey } from '../IHamu360ShellProps';

export interface IHomePageProps {
  currentUser: ICurrentUser;
  /** `undefined` means "no message from the Managing Partner this week" — see `IHamu360ShellProps.ts`'s docblock. `HeroSection` renders `EmptyState` for this case. */
  partnerMessage: IPartnerMessage | undefined;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  userGroups: string[];
  events: IEvent[];
  newJoiners: INewJoiner[];
  regulatoryUpdates: IRegulatoryUpdate[];
  firmWins: IFirmWin[];
  pageStatus: Hamu360PageStatus;
  loadError?: string;
  failedSections: Hamu360SectionKey[];
}
