import type { IconName } from '@components/Icon';

/**
 * Field-for-field mirror of the real "Quick Links" SharePoint List
 * (`HOS_Platform_Readiness_Gate_v1.md` section 3.4: columns Label, URL,
 * Icon, SortOrder; 8 seed rows, status Complete) — same rationale as
 * `IAnnouncement`'s docblock. The real list's `Icon` column is presumably a
 * free-text glyph name; here it's typed as the closed `IconName` union so a
 * List row referencing an icon this app doesn't render is a compile error
 * in whatever maps it, not a silent blank icon at runtime.
 */
export interface IQuickLink {
  id: string;
  /** List column: Label */
  label: string;
  /**
   * List column: URL. Sprint 3's mock data uses `'#'` for every row — the
   * real column values aren't present in any document available to this
   * sprint (only the 8 labels and their order are documented). Flagged in
   * `MockQuickLinksService.ts`; do not treat `'#'` as real data.
   */
  url: string;
  /** List column: Icon */
  icon: IconName;
  /** List column: SortOrder */
  sortOrder: number;
}
