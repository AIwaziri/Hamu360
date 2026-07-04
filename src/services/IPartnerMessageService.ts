import type { IPartnerMessage } from '@models/index';

/**
 * Same "interface first, concrete implementation swapped by `ServiceFactory`"
 * shape as `ICurrentUserService`. Only a `Mock` implementation exists this
 * sprint — see `ServiceFactory.ts`'s `createPartnerMessageService` for
 * exactly where Sprint 6's `services/SharePoint/SharePointPartnerMessageService.ts`
 * (backed by the SharePoint News API) plugs in later.
 */
export interface IPartnerMessageService {
  getPartnerMessage(): Promise<IPartnerMessage>;
}
