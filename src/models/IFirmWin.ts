/**
 * Field-for-field mirror of the real "Firm Wins" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: versioning enabled (10
 * major), Default view, 4 seed rows, status Complete).
 *
 * `date` exists on the model and is used for sorting (`FirmWinsWidget` shows
 * "top 4 by date descending", per the Sprint 5 brief) even though the
 * wireframe's `.wr` rows never display a date anywhere — the same
 * "modeled but not necessarily rendered" treatment `IEvent.audience` gets.
 * Unlike `audience`, though, `date` genuinely has no wireframe-visible value
 * to source from; `MockFirmWinsService`'s four seed dates are an inference
 * (the wireframe's own row order, treated as already-most-recent-first),
 * flagged there, not confirmed against the live List's actual `Date` column
 * values.
 */
export interface IFirmWin {
  id: string;
  /** List column: Title. The wireframe's `.wrtxt` copy. */
  title: string;
  /** List column: Category. `'Ranking' | 'NewClient' | 'MatterClosed' | 'Knowledge'` — matches the wireframe's four `.wrtag` values exactly (`RANKING`/`NEW CLIENT`/`MATTER CLOSED`/`KNOWLEDGE`), PascalCase rather than the display's upper-case-with-spaces since this is the raw List choice value, not display text. */
  category: 'Ranking' | 'NewClient' | 'MatterClosed' | 'Knowledge';
  /** List column: Date. ISO 8601 date string. Not rendered — see docblock above. */
  date: string;
}
