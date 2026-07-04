import type { EnvironmentName } from '@config/environment';
import type { IAnnouncement, ICurrentUser, IPartnerMessage, IQuickLink } from '@models/index';

export interface IHubCardShowcaseProps {
  currentUser: ICurrentUser;
  partnerMessage: IPartnerMessage;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  environment: EnvironmentName;
}
