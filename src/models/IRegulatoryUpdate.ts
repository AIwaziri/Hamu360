/**
 * Field-for-field mirror of the real "Regulatory Updates" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: versioning not required,
 * Default view, 4 seed rows, status Complete).
 *
 * `practiceArea` uses the same four workstream codes defined in
 * `HOS_Documentation_v1.md` section 5.1 (`CC`/`GRC`/`IP`/`DR`) — not
 * invented here. Only `GRC` and `IP` appear in the four approved seed rows;
 * `CC` and `DR` are included in the type because they're real, valid values
 * the live List's choice column supports, even though no seed row
 * exercises them yet.
 */
export interface IRegulatoryUpdate {
  id: string;
  /** List column: Title. The wireframe's `.rrtxt` copy — full regulatory summary text, not a headline + separate body. */
  title: string;
  /** List column: Date. ISO 8601 date string. */
  date: string;
  /** List column: PracticeArea. `CC` = Corporate & Commercial, `GRC` = Governance, Risk & Compliance, `IP` = Intellectual Property & Data Privacy, `DR` = Dispute Resolution — see `HOS_Documentation_v1.md` §5.1. */
  practiceArea: 'CC' | 'GRC' | 'IP' | 'DR';
}
