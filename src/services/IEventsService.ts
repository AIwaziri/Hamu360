import type { IEvent } from '@models/index';

/**
 * Returns every event the caller is allowed to see, unsorted and untrimmed —
 * "next 4, soonest first" is `EventsWidget`'s own presentation concern (see
 * that component's docblock), not this service's. Mirrors
 * `IAnnouncementsService`'s exact contract shape and reasoning: the real
 * Sprint 6 implementation can return however many rows the live "Events"
 * List has (it currently has a "Default" view — no server-side date
 * filtering configured, per `HOS_Platform_Readiness_Gate_v1.md` §3.4) and
 * this contract doesn't change.
 */
export interface IEventsService {
  getEvents(): Promise<IEvent[]>;
}
