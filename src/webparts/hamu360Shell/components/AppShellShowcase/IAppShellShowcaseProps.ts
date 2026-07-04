import type { EnvironmentName } from '@config/environment';
import type { ICurrentUser } from '@models/index';

export interface IAppShellShowcaseProps {
  currentUser: ICurrentUser;
  environment: EnvironmentName;
}
