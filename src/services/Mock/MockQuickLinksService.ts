import type { IQuickLink } from '@models/index';

import type { IQuickLinksService } from '../IQuickLinksService';

/**
 * Seed content is the approved wireframe's own eight `.ql` tiles verbatim,
 * in the same order (`HOS_All_Departments_Wireframe_v1.html`), which also
 * matches both the Platform Readiness Gate's "Quick Links: 8 rows, seed
 * data Complete" and `HOS_Documentation_v1.md` section 3.1's identical
 * eight-item list. Labels and icons are real; `sortOrder` (1-8) reproduces
 * the documented/wireframe display order exactly.
 *
 * FLAGGED: `url` is `'#'` for every row. No document available to this
 * sprint records the real List's `URL` column values (only labels, icons,
 * and order are documented) — `'#'` is a placeholder, not real data.
 * `QuickLinksGrid` renders these as inert buttons rather than real links
 * for exactly this reason (see its docblock); do not wire real navigation
 * to `'#'`. Get the real URLs from the live list before Sprint 6.
 */
export class MockQuickLinksService implements IQuickLinksService {
  public async getQuickLinks(): Promise<IQuickLink[]> {
    return [
      { id: 'ql-1', label: 'Open matter', url: '#', icon: 'folder-open', sortOrder: 1 },
      { id: 'ql-2', label: 'New document', url: '#', icon: 'file-plus', sortOrder: 2 },
      { id: 'ql-3', label: 'Templates', url: '#', icon: 'template', sortOrder: 3 },
      { id: 'ql-4', label: 'Raise invoice', url: '#', icon: 'report-money', sortOrder: 4 },
      { id: 'ql-5', label: 'Precedents', url: '#', icon: 'book', sortOrder: 5 },
      { id: 'ql-6', label: 'Staff directory', url: '#', icon: 'users', sortOrder: 6 },
      { id: 'ql-7', label: 'IT help desk', url: '#', icon: 'device-laptop', sortOrder: 7 },
      { id: 'ql-8', label: 'Book a room', url: '#', icon: 'calendar-event', sortOrder: 8 }
    ];
  }
}
