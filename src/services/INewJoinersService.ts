import type { INewJoiner } from '@models/index';

/**
 * Returns the new joiners the caller is allowed to see. Unlike
 * `IEventsService`/`IRegulatoryUpdatesService`/`IFirmWinsService`, this
 * contract does NOT promise "unsorted and untrimmed, full List contents" —
 * the real "Employee Onboarding" List already has a dedicated "90-Day
 * filtered view" configured server-side (`HOS_Platform_Readiness_Gate_v1.md`
 * §3.4, the only one of this sprint's four Lists with a named view rather
 * than "Default"). That means the 90-day windowing is this service's job
 * (in Sprint 6, by querying through that view — or an equivalent
 * server-side filter — rather than pulling the full List and filtering
 * client-side), not `NewJoinersWidget`'s. See that component's own docblock
 * for the full reasoning and what would need to change if this
 * assumption turns out to be wrong once Sprint 6 inspects the live view.
 */
export interface INewJoinersService {
  /** Already scoped to "recent" per whatever window the real List's view defines — callers should not re-filter by date. */
  getNewJoiners(): Promise<INewJoiner[]>;
}
