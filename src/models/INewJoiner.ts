/**
 * Field-for-field mirror of the real "Employee Onboarding" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: versioning not required,
 * a dedicated "90-Day filtered view", 3 seed rows, status Complete).
 *
 * The "90-Day filtered view" is the one List among this sprint's four that
 * has a *named, purpose-built* view rather than the generic "Default" view
 * the other three use (Events, Regulatory Updates, Firm Wins) — see
 * `NewJoinersWidget`'s own docblock for what that difference means for
 * where the 90-day windowing logic actually lives (answer: not in this
 * component, and not in `MockNewJoinersService` either).
 *
 * `department`/`role` are modeled as two separate columns rather than one
 * combined "role" string, matching how the wireframe itself renders two of
 * its three seed rows as `"{department} · {role}"` (e.g. "CC · Associate").
 * The third seed row ("IT Admin") renders as a single string with no
 * separator — `role` is `undefined` for that row, and `NewJoinersWidget`
 * falls back to `department` alone, reproducing the wireframe's own
 * inconsistency faithfully rather than inventing a role value it doesn't
 * have.
 */
export interface INewJoiner {
  id: string;
  /** List column: Title (person's display name). */
  name: string;
  /** List column: Department. */
  department: string;
  /** List column: Role. Optional — see docblock above (the "IT Admin" seed row has none). */
  role?: string;
  /** List column: JoinDate. ISO 8601 date string. Deliberately day-precise even though the UI only ever displays month+year (`formatMonthYear`) — see that util's docblock. */
  joinDate: string;
  /**
   * Not a real List column — a presentation-only hint mirroring
   * `HubCard`'s `iconVariant` vocabulary (`'default' | 'primary'`) for the
   * avatar's color treatment. The wireframe's own three seed rows use the
   * pale/dark-gold avatar for two rows and an explicit navy/gold override
   * for the third (`"IT Admin"`) — reproduced here as data rather than a
   * one-off inline style, so which rows get the alternate treatment is
   * visible in the mock seed data instead of buried in component markup.
   * @default 'default'
   */
  avatarVariant?: 'default' | 'primary';
}
