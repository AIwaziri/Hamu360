import type { IEvent } from '@models/index';

import type { IEventsService } from '../IEventsService';

/**
 * Seed content is the approved wireframe's own four `.ev-row` entries
 * verbatim (`HOS_All_Departments_Wireframe_v1.html`), which also matches
 * the Platform Readiness Gate's "Events: 4 rows, seed data Complete" — real
 * firm content, not Lorem Ipsum.
 *
 * Dates are 2026 (not stated explicitly by the wireframe's date-box, which
 * only shows day + month) — corroborated, not guessed: Sprint 3's
 * `MockAnnouncementsService` already independently dates its own
 * "Q2 QBR — Friday July 4, 10am, Conference Room A" and "HOS beta launch —
 * all-staff walkthrough July 14" announcements to 2026, referring to these
 * exact same two events. Reusing 2026 here keeps the two mock datasets
 * internally consistent rather than accidentally contradicting each other.
 *
 * Returned in the List's natural (unsorted) order, per `IEventsService`'s
 * contract — `EventsWidget` is the one that sorts ascending by `startDate`.
 */
export class MockEventsService implements IEventsService {
  public async getEvents(): Promise<IEvent[]> {
    return [
      {
        id: 'evt-1',
        title: 'New office — Wuse 2',
        startDate: '2026-07-01',
        location: 'All-hands move day'
      },
      {
        id: 'evt-2',
        title: 'Q2 QBR',
        startDate: '2026-07-04',
        location: '10am · Conference Room A'
      },
      {
        id: 'evt-3',
        title: 'HOS staff walkthrough',
        startDate: '2026-07-14',
        location: 'All staff · 2pm'
      },
      {
        id: 'evt-4',
        title: 'Performance review deadline',
        startDate: '2026-06-30',
        location: 'Submit to HR'
      }
    ];
  }
}
