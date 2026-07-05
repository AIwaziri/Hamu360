/**
 * Field-for-field mirror of the real "Events" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: Events, versioning not
 * required, Default view, 4 seed rows, status Complete) — same discipline as
 * `IAnnouncement`/`IQuickLink` from Sprint 3: camelCase renames of the exact
 * same columns, no restructuring, so Sprint 6's real mapping in
 * `services/SharePoint/SharePointEventsService.ts` is a straight field
 * match.
 *
 * `audience` mirrors the List's `Audience` column even though nothing in
 * this sprint reads it — the Sprint 5 brief calls this out explicitly as
 * future-proofing for if event-level audience targeting is ever needed
 * (the same `SG-HOS-*` group-name shape `IAudienceService` already uses, not
 * a new shape). `EventsWidget` never checks this field; per this sprint's
 * non-goals, all four dashboard widgets are SG-HOS-AllStaff visible with no
 * per-item filtering.
 */
export interface IEvent {
  id: string;
  /** List column: Title */
  title: string;
  /** List column: StartDate. ISO 8601 date string. */
  startDate: string;
  /**
   * List column: EndDate. ISO 8601 date string. Optional because every
   * seed row is a single-day event with no observed EndDate value distinct
   * from StartDate in the approved wireframe — not confirmed absent from
   * the real List, just unexercised by the seed content available.
   */
  endDate?: string;
  /**
   * List column: Location. The wireframe's `.ev-sub` line under each event
   * title is rendered from this field, but its four seed values ("All-hands
   * move day", "10am · Conference Room A", "All staff · 2pm", "Submit to
   * HR") are a mix of a literal room name, a time+room combination, and
   * plain instructional text — only one of the four reads as a location in
   * the strict sense. This is flagged as an inferred List-usage pattern
   * (many small-org calendar Lists use a single free-text "Location" column
   * loosely as "context line"), not a confirmed convention read from the
   * live List — verify once Sprint 6 wires PnPjs.
   */
  location: string;
  /** List column: Audience. Group names, same shape as `IAudienceService.getUserGroups()`. Unused this sprint — see docblock above. */
  audience?: string[];
}
