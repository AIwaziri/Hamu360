/**
 * Field-for-field mirror of the real "Announcements" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: columns Title, Body,
 * Author, PublishDate, Pinned; versioning enabled; 4 seed rows, status
 * Complete). Deliberately shaped this way — camelCase renames of the exact
 * same columns, no restructuring — so Sprint 6's real mapping in
 * `services/SharePoint/SharePointAnnouncementsService.ts` is
 * `{ id: item.Id.toString(), title: item.Title, body: item.Body, author:
 * item.Author, publishDate: item.PublishDate, pinned: item.Pinned }` and
 * nothing else: a straight field match, not a reshape. Contrast with
 * `IPartnerMessage`, which is intentionally generic because its real source
 * (News API) isn't a custom List with a known column set.
 */
export interface IAnnouncement {
  id: string;
  /** List column: Title */
  title: string;
  /** List column: Body */
  body: string;
  /** List column: Author. Free text in the real list, not a lookup to a person — the wireframe's own seed values mix individual names ("From Fali") and team names ("People & Culture", "IT Admin"). */
  author: string;
  /** List column: PublishDate. ISO 8601 date string. */
  publishDate: string;
  /**
   * List column: Pinned. Sprint 3's mock data marks exactly one row `true`
   * (see `MockAnnouncementsService.ts`) based on its position in the
   * approved wireframe, not a confirmed real column value — flagged there
   * for verification once Sprint 6 reads the live list.
   */
  pinned: boolean;
}
