import type { INewJoiner } from '@models/index';

import type { INewJoinersService } from '../INewJoinersService';

/**
 * Seed content is the approved wireframe's own three `.jr` rows verbatim
 * (`HOS_All_Departments_Wireframe_v1.html`), matching the Platform
 * Readiness Gate's "Employee Onboarding: 3 rows, seed data Complete" — real
 * firm content, not Lorem Ipsum.
 *
 * Per `INewJoinersService`'s contract, this already represents the "90-Day
 * filtered view" result — these are the only 3 rows returned, full stop, no
 * further filtering expected from any caller.
 *
 * `joinDate` day-of-month is an inference for all three rows: the wireframe
 * badge only ever shows `"Jun 2026"` (month + year). The month/year
 * themselves are corroborated, not guessed — Sprint 3's
 * `MockAnnouncementsService` independently dates its "Deborah Tatama joins
 * CC practice — welcome!" announcement to 2026-06-22, referring to the same
 * person's arrival, so `deborah-tatama`'s `joinDate` is set to that exact
 * date rather than an arbitrary one. The other two rows' exact days are
 * unconfirmed placeholders within June 2026 — verify against the live List
 * once Sprint 6 wires PnPjs.
 */
export class MockNewJoinersService implements INewJoinersService {
  public async getNewJoiners(): Promise<INewJoiner[]> {
    return [
      {
        id: 'joiner-deborah-tatama',
        name: 'Deborah Tatama',
        department: 'CC',
        role: 'Associate',
        // Corroborated against MockAnnouncementsService's ann-2 publishDate — see docblock above.
        joinDate: '2026-06-22'
      },
      {
        id: 'joiner-saadatu-hamu-aliyu',
        name: 'Saadatu Hamu Aliyu',
        department: 'Finance',
        role: 'CFO',
        joinDate: '2026-06-15'
      },
      {
        id: 'joiner-it-admin',
        name: 'IT Admin',
        department: 'Digital Operations & Systems',
        // No `role` — the wireframe renders this row as a single string with
        // no "department · role" separator, unlike the other two rows. See
        // `INewJoiner.role`'s docblock.
        joinDate: '2026-06-10',
        // The wireframe overrides this one row's avatar to navy/gold
        // (`style="background: var(--nv); color: var(--g)"`) instead of the
        // other two rows' pale/dark-gold default — reproduced as data, see
        // `INewJoiner.avatarVariant`'s docblock.
        avatarVariant: 'primary'
      }
    ];
  }
}
