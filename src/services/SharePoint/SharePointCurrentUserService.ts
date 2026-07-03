import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { ICurrentUser } from '@models/index';

import type { ICurrentUserService } from '../ICurrentUserService';

/**
 * Real implementation, backed by the SPFx page context. No REST/Graph call
 * is needed for this particular service — `pageContext.user` is already
 * populated by the framework — but the async signature is kept consistent
 * with every other service so callers never need to know which ones are
 * "free" and which ones hit the network.
 */
export class SharePointCurrentUserService implements ICurrentUserService {
  public constructor(private readonly context: WebPartContext) {}

  public async getCurrentUser(): Promise<ICurrentUser> {
    const { displayName, email, loginName } = this.context.pageContext.user;

    return {
      id: loginName,
      displayName,
      email,
      loginName
    };
  }
}
