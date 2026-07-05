import type { IRegulatoryUpdate } from '@models/index';

import type { IRegulatoryUpdatesService } from '../IRegulatoryUpdatesService';

/**
 * Seed content is the approved wireframe's own four `.rr` entries verbatim
 * (`HOS_All_Departments_Wireframe_v1.html`), matching the Platform
 * Readiness Gate's "Regulatory Updates: 4 rows, seed data Complete" — real
 * firm content, not Lorem Ipsum. Dates are 2026, consistent with every
 * other mock service's seed content this build (Sprint 3's Announcements,
 * this sprint's Events/New Joiners) — the wireframe's own `.rrdate` text
 * ("Jun 20", "Jun 15", "Jun 10", "Jun 5") doesn't state a year, but nothing
 * elsewhere in the approved content contradicts 2026 either.
 *
 * Returned in the List's natural (unsorted) order, per
 * `IRegulatoryUpdatesService`'s contract — `RegulatoryUpdatesWidget` is the
 * one that sorts descending by `date`. As it happens, the wireframe's own
 * row order already is date-descending, so this array's order and the
 * widget's post-sort order are identical — that's the wireframe being
 * internally consistent, not this service doing the widget's job.
 */
export class MockRegulatoryUpdatesService implements IRegulatoryUpdatesService {
  public async getRegulatoryUpdates(): Promise<IRegulatoryUpdate[]> {
    return [
      {
        id: 'reg-cbn-fintech-licensing',
        title: 'CBN issues new fintech licensing framework — tighter compliance requirements from Q3',
        date: '2026-06-20',
        practiceArea: 'GRC'
      },
      {
        id: 'reg-nitda-ndpr',
        title: 'NITDA releases updated NDPR implementation framework — DPO obligations expanded',
        date: '2026-06-15',
        practiceArea: 'IP'
      },
      {
        id: 'reg-sec-capital-market',
        title: 'SEC Nigeria publishes new capital market operator guidelines — effective August 2026',
        date: '2026-06-10',
        practiceArea: 'GRC'
      },
      {
        id: 'reg-fccpc-consumer-protection',
        title: 'FCCPC issues consumer protection notice — fintech and e-commerce operators',
        date: '2026-06-05',
        practiceArea: 'GRC'
      }
    ];
  }
}
