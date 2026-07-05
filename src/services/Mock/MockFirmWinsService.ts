import type { IFirmWin } from '@models/index';

import type { IFirmWinsService } from '../IFirmWinsService';

/**
 * Seed content is the approved wireframe's own four `.wr` entries verbatim
 * (`HOS_All_Departments_Wireframe_v1.html`), matching the Platform
 * Readiness Gate's "Firm Wins: 4 rows, seed data Complete" — real firm
 * content, not Lorem Ipsum.
 *
 * `date` is a genuine inference, flagged distinctly from every other date
 * in this sprint's mock data: the wireframe's `.wr` rows never display a
 * date at all (see `IFirmWin.date`'s docblock), so there is no wireframe
 * value to corroborate against. These four dates exist only so
 * `FirmWinsWidget`'s "top 4 by date descending" sort has something to sort
 * by, and were chosen to preserve the wireframe's own row order (treated as
 * already most-recent-first) rather than to represent confirmed real dates.
 * Replace with the live List's actual `Date` values once Sprint 6 wires
 * PnPjs — do not treat these as firm history.
 *
 * Returned in the List's natural (unsorted) order, per `IFirmWinsService`'s
 * contract — `FirmWinsWidget` is the one that sorts descending by `date`.
 */
export class MockFirmWinsService implements IFirmWinsService {
  public async getFirmWins(): Promise<IFirmWin[]> {
    return [
      {
        id: 'win-iflr1000-ranking',
        title: 'Hamu Legal ranked in IFLR1000 — Nigeria Dispute Resolution 2026',
        category: 'Ranking',
        date: '2026-06-26'
      },
      {
        id: 'win-hni-fintech-client',
        title: 'HNI Fintech retained Hamu Legal for CBN licensing advisory',
        category: 'NewClient',
        date: '2026-06-19'
      },
      {
        id: 'win-griot-studios-matter-closed',
        title: 'IP Assignment Deed completed — Griot Studios transaction closed',
        category: 'MatterClosed',
        date: '2026-06-12'
      },
      {
        id: 'win-gas-sector-precedent',
        title: 'New precedent added — Gas sector licence acquisition agreement',
        category: 'Knowledge',
        date: '2026-06-08'
      }
    ];
  }
}
