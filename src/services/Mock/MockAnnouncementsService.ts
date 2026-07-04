import type { IAnnouncement } from '@models/index';

import type { IAnnouncementsService } from '../IAnnouncementsService';

/**
 * Seed content is the approved wireframe's own four `.anr` rows verbatim
 * (`HOS_All_Departments_Wireframe_v1.html`), which also matches the
 * Platform Readiness Gate's "Announcements: 4 rows, seed data Complete" —
 * this is the real firm's real content, not Lorem Ipsum.
 *
 * Two fields are flagged approximations rather than confirmed List values:
 *
 * - `body`: every row is `''`. The wireframe's compact hero card only ever
 *   renders one line of text per announcement (`.anr-t`) alongside date and
 *   author — there is no second line anywhere in the approved design that
 *   could be this List's separate `Body` column value. `AnnouncementsFeed`
 *   deliberately doesn't render `body` for the same reason (see its
 *   docblock). Do not fill this with invented copy — get the real value
 *   from the live list once Sprint 6 wires PnPjs.
 * - `pinned`: exactly one row (`ann-1`) is `true`, chosen because it's the
 *   first row in the wireframe's fixed display order and is leadership-
 *   authored operational news — a reasonable pinned candidate, but an
 *   inference from position, not a confirmed value read from the live
 *   list's `Pinned` column. Verify before Sprint 6 sign-off.
 */
export class MockAnnouncementsService implements IAnnouncementsService {
  public async getAnnouncements(): Promise<IAnnouncement[]> {
    return [
      {
        id: 'ann-1',
        title: 'New office — Wuse 2 handover confirmed July 1',
        body: '',
        author: 'From Fali',
        publishDate: '2026-06-24',
        pinned: true
      },
      {
        id: 'ann-2',
        title: 'Deborah Tatama joins CC practice — welcome!',
        body: '',
        author: 'People & Culture',
        publishDate: '2026-06-22',
        pinned: false
      },
      {
        id: 'ann-3',
        title: 'Q2 QBR — Friday July 4, 10am, Conference Room A',
        body: '',
        author: 'From Fali',
        publishDate: '2026-06-20',
        pinned: false
      },
      {
        id: 'ann-4',
        title: 'HOS beta launch — all-staff walkthrough July 14',
        body: '',
        author: 'IT Admin',
        publishDate: '2026-06-18',
        pinned: false
      }
    ];
  }
}
