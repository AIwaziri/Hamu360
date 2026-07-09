import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IEnvironmentConfig } from '@config/environment';

import type { IAnnouncementsService } from './IAnnouncementsService';
import type { IAudienceService } from './IAudienceService';
import type { ICurrentUserService } from './ICurrentUserService';
import type { IEventsService } from './IEventsService';
import type { IFirmWinsService } from './IFirmWinsService';
import type { INewJoinersService } from './INewJoinersService';
import type { IPartnerMessageService } from './IPartnerMessageService';
import type { IQuickLinksService } from './IQuickLinksService';
import type { IRegulatoryUpdatesService } from './IRegulatoryUpdatesService';
import { MockAnnouncementsService } from './Mock/MockAnnouncementsService';
import { MockAudienceService } from './Mock/MockAudienceService';
import { MockCurrentUserService } from './Mock/MockCurrentUserService';
import { MockEventsService } from './Mock/MockEventsService';
import { MockFirmWinsService } from './Mock/MockFirmWinsService';
import { MockNewJoinersService } from './Mock/MockNewJoinersService';
import { MockPartnerMessageService } from './Mock/MockPartnerMessageService';
import { MockQuickLinksService } from './Mock/MockQuickLinksService';
import { MockRegulatoryUpdatesService } from './Mock/MockRegulatoryUpdatesService';
import { GraphAudienceService } from './SharePoint/GraphAudienceService';
import { SharePointAnnouncementsService } from './SharePoint/SharePointAnnouncementsService';
import { SharePointCurrentUserService } from './SharePoint/SharePointCurrentUserService';
import { SharePointEventsService } from './SharePoint/SharePointEventsService';
import { SharePointFirmWinsService } from './SharePoint/SharePointFirmWinsService';
import { SharePointNewJoinersService } from './SharePoint/SharePointNewJoinersService';
import { SharePointPartnerMessageService } from './SharePoint/SharePointPartnerMessageService';
import { SharePointQuickLinksService } from './SharePoint/SharePointQuickLinksService';
import { SharePointRegulatoryUpdatesService } from './SharePoint/SharePointRegulatoryUpdatesService';

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
 * Sprint 6: every function below now branches on `env.useMockData`, exactly
 * like `createCurrentUserService` above always did. This is the entire
 * Sprint 6 diff for this file — nine `return new Mock...()` lines each
 * became a one-line ternary, nothing else in this file changed shape, no
 * function's parameters changed, and no caller (`Hamu360ShellWebPart.onInit`)
 * needed to change how it calls any of these. That was the whole point of
 * every prior sprint's "ServiceFactory is the only file that changes"
 * promise — see each function's own inline note for anything
 * service-specific worth knowing.
 */
export function createPartnerMessageService(context: WebPartContext, env: IEnvironmentConfig): IPartnerMessageService {
  return env.useMockData ? new MockPartnerMessageService() : new SharePointPartnerMessageService(context);
}

export function createAnnouncementsService(context: WebPartContext, env: IEnvironmentConfig): IAnnouncementsService {
  return env.useMockData ? new MockAnnouncementsService() : new SharePointAnnouncementsService(context);
}

export function createQuickLinksService(context: WebPartContext, env: IEnvironmentConfig): IQuickLinksService {
  return env.useMockData ? new MockQuickLinksService() : new SharePointQuickLinksService(context);
}

/**
 * Sprint 4's audience/authorization gate — now backed by
 * `GraphAudienceService` (Microsoft Graph `/me/memberOf`) in every
 * non-local environment, per Platform Readiness Gate §3.2's sign-off. The
 * "always default-deny" posture this function's docblock described since
 * Sprint 4 is no longer just a statement about `MockAudienceService`'s
 * default argument — `GraphAudienceService.getUserGroups()` itself now
 * enforces the same posture against real failure modes (a Graph error, a
 * timeout, a missing consent grant), collapsing every one of them to
 * `[SG_HOS_ALL_STAFF]`. See that class's own docblock for the full
 * reasoning, and `SPRINT_6_INTEGRATION_CHECKLIST.md` items #3 and #4 for
 * what still needs verifying against the real tenant before this gate is
 * trusted in production.
 */
export function createAudienceService(context: WebPartContext, env: IEnvironmentConfig): IAudienceService {
  return env.useMockData ? new MockAudienceService() : new GraphAudienceService(context);
}

export function createEventsService(context: WebPartContext, env: IEnvironmentConfig): IEventsService {
  return env.useMockData ? new MockEventsService() : new SharePointEventsService(context);
}

export function createNewJoinersService(context: WebPartContext, env: IEnvironmentConfig): INewJoinersService {
  return env.useMockData ? new MockNewJoinersService() : new SharePointNewJoinersService(context);
}

export function createRegulatoryUpdatesService(
  context: WebPartContext,
  env: IEnvironmentConfig
): IRegulatoryUpdatesService {
  return env.useMockData ? new MockRegulatoryUpdatesService() : new SharePointRegulatoryUpdatesService(context);
}

export function createFirmWinsService(context: WebPartContext, env: IEnvironmentConfig): IFirmWinsService {
  return env.useMockData ? new MockFirmWinsService() : new SharePointFirmWinsService(context);
}
