import type { EnvironmentName } from '@config/environment';
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

export interface IDashboardWidgetShowcaseProps {
  currentUser: ICurrentUser;
  partnerMessage: IPartnerMessage;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  events: IEvent[];
  newJoiners: INewJoiner[];
  regulatoryUpdates: IRegulatoryUpdate[];
  firmWins: IFirmWin[];
  environment: EnvironmentName;
}
