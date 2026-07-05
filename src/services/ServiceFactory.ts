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

/**
 * Sprint 4's audience/authorization gate. Same shape and same "Mock only
 * for now" state as the three functions above, with one deliberate
 * difference worth calling out explicitly given what this one function
 * protects: it constructs `MockAudienceService` with its **default**
 * argument (`[SG_HOS_ALL_STAFF]`, the least-privileged group set) rather
 * than passing anything through from `context`/`env`. There is no signal
 * anywhere in this codebase, mock or real, that could tell this function
 * "this particular user is the Managing Partner" — and a security gate
 * that can't positively confirm elevated access must default to denying
 * it, never granting it. `HubCardShowcase`'s toggle demonstrates the
 * *other* state by constructing its own second `MockAudienceService`
 * directly (see that component's docblock) — it never calls this function
 * with different arguments, because this function doesn't accept any.
 *
 * Sprint 6 replaces the body with a real Microsoft Graph
 * `/me/memberOf`-backed service — and ONLY after
 * `HOS_Platform_Readiness_Gate_v1.md` section 3.2 (Authorization) is
 * signed off, per this sprint's explicit non-goals. Until then, this
 * function is the entire real "backend" for every audience check in the
 * product: `HubCardGrid` calls nothing else.
 */
export function createAudienceService(_context: WebPartContext, _env: IEnvironmentConfig): IAudienceService {
  return new MockAudienceService();
}

/**
 * Sprint 5's four Dashboard Widget services. Same "always Mock for now,
 * `(context, env)` params already present for arity stability" shape as the
 * Sprint 3 trio above — none of these four Lists are being queried via
 * PnPjs yet, per this sprint's explicit non-goals.
 *
 * Unlike the audience gate above, none of these four carry any
 * authorization weight — all four source Lists are SG-HOS-AllStaff visible
 * (per `HOS_Platform_Readiness_Gate_v1.md` §3.2), so "always return the
 * least-privileged default" isn't a relevant concept here the way it is for
 * `createAudienceService`. These simply don't have a real implementation
 * yet.
 */
export function createEventsService(_context: WebPartContext, _env: IEnvironmentConfig): IEventsService {
  return new MockEventsService();
}

export function createNewJoinersService(_context: WebPartContext, _env: IEnvironmentConfig): INewJoinersService {
  return new MockNewJoinersService();
}

export function createRegulatoryUpdatesService(
  _context: WebPartContext,
  _env: IEnvironmentConfig
): IRegulatoryUpdatesService {
  return new MockRegulatoryUpdatesService();
}

export function createFirmWinsService(_context: WebPartContext, _env: IEnvironmentConfig): IFirmWinsService {
  return new MockFirmWinsService();
}
