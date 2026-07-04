import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IEnvironmentConfig } from '@config/environment';

import type { IAnnouncementsService } from './IAnnouncementsService';
import type { ICurrentUserService } from './ICurrentUserService';
import type { IPartnerMessageService } from './IPartnerMessageService';
import type { IQuickLinksService } from './IQuickLinksService';
import { MockAnnouncementsService } from './Mock/MockAnnouncementsService';
import { MockCurrentUserService } from './Mock/MockCurrentUserService';
import { MockPartnerMessageService } from './Mock/MockPartnerMessageService';
import { MockQuickLinksService } from './Mock/MockQuickLinksService';
import { SharePointCurrentUserService } from './SharePoint/SharePointCurrentUserService';

/**
 * The one place in the codebase that is allowed to know both concrete
 * service implementations exist. It reads `IEnvironmentConfig.useMockData`
 * (see `src/config/environment.ts`) and hands back whichever one applies —
 * every caller just gets an `ICurrentUserService`.
 *
 * As new services are added (`ICaseService`, `IDocumentService`, ...), add
 * one factory function per service here rather than growing a single
 * god-function; keeps each service's construction dependencies explicit.
 */
export function createCurrentUserService(context: WebPartContext, env: IEnvironmentConfig): ICurrentUserService {
  return env.useMockData ? new MockCurrentUserService() : new SharePointCurrentUserService(context);
}

/**
 * Sprint 3's three Hero content services (`createPartnerMessageService`,
 * `createAnnouncementsService`, `createQuickLinksService` below) follow the
 * exact same shape as `createCurrentUserService` above, on purpose — the
 * brief for this sprint is explicit that this precedent should be reused,
 * not reinvented. The one difference: none of them branches on
 * `env.useMockData` yet, because unlike identity (which already had a real
 * `SharePointCurrentUserService` from Sprint 0), Sprint 3 was explicitly
 * told not to touch PnPjs/real Lists. Each function unconditionally
 * constructs its `Mock*` implementation for now.
 *
 * Sprint 6 adds `services/SharePoint/SharePointPartnerMessageService.ts`,
 * `SharePointAnnouncementsService.ts`, `SharePointQuickLinksService.ts` —
 * each implementing the matching interface — and changes exactly the
 * `return new Mock...()` line in each function below to
 * `return env.useMockData ? new Mock...() : new SharePoint...(context);`,
 * identical to `createCurrentUserService`. No caller of these three
 * functions, and no component downstream of them, needs to change.
 *
 * Each function already takes the same `(context, env)` parameters as
 * `createCurrentUserService`, even though neither is used yet — so the web
 * part's call sites don't need to change arity when Sprint 6 adds the real
 * branch, only these three function bodies do.
 */
export function createPartnerMessageService(
  _context: WebPartContext,
  _env: IEnvironmentConfig
): IPartnerMessageService {
  return new MockPartnerMessageService();
}

export function createAnnouncementsService(_context: WebPartContext, _env: IEnvironmentConfig): IAnnouncementsService {
  return new MockAnnouncementsService();
}

export function createQuickLinksService(_context: WebPartContext, _env: IEnvironmentConfig): IQuickLinksService {
  return new MockQuickLinksService();
}
