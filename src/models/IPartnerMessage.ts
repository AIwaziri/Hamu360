/**
 * The Home page's "Message from [Managing Partner]" card. Per
 * `HOS_Documentation_v1.md` section 3.1 ("Card 1: Message from Fali"), the
 * real Sprint 6 source for this is "a News web part with a featured post
 * from Fali's account" — i.e. SharePoint's News API, not a custom List like
 * Announcements/Quick Links.
 *
 * Deliberately generic rather than shaped like that News API (no
 * `PublishingPageContent`-style fields, no page/list item plumbing): the
 * News API's exact shape isn't pinned down yet, and a generic shape here
 * means Sprint 6 writes one small mapping function in
 * `services/SharePoint/SharePointPartnerMessageService.ts` (author fields,
 * body, date -> this interface) without this interface — or
 * `PartnerMessageCard`, which only ever sees this interface — needing to
 * change. Contrast with `IAnnouncement`/`IQuickLink`, which deliberately DO
 * mirror their real List columns 1:1, because those real Lists (and their
 * exact column names) already exist.
 */
export interface IPartnerMessage {
  id: string;
  authorName: string;
  authorRole: string;
  /**
   * How the author is addressed informally elsewhere in the product (e.g.
   * "Fali" for Saadatu Hamu Aliyu) — this is what the card's own heading
   * ("Message from Fali") uses, kept separate from `authorName` (the full
   * name shown in the card body) rather than trying to derive a nickname
   * from a full name programmatically. Optional: falls back to the first
   * word of `authorName` if omitted.
   */
  authorPreferredName?: string;
  /**
   * Initials shown in the avatar placeholder until a real photo exists.
   * Deliberately not `authorPhotoUrl` yet — no photo asset exists for this
   * card in Sprint 1's `src/assets` (same situation `Header`'s Logo hit in
   * Sprint 2), and inventing a fake image path would be worse than an
   * honest initials placeholder.
   */
  authorInitials: string;
  message: string;
  /** ISO 8601 date string. */
  publishedDate: string;
}
