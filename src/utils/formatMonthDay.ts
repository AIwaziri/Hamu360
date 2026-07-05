/**
 * Formats an ISO 8601 date string as `"Jun 20"` — month first, then day, no
 * year. Sibling to `formatDate.ts` (`"24 Jun 2026"`), not a replacement for
 * it: `RegulatoryUpdatesWidget`'s `.rrdate` line (`"Jun 20 · GRC"`) and
 * `NewJoinersWidget` need this shorter, year-less form, while `formatDate`
 * remains the one Sprint 3's `AnnouncementsFeed`/`PartnerMessageCard` use —
 * changing its output format would change those two components too.
 *
 * `en-US`'s default `{ month: 'short', day: 'numeric' }` ordering already
 * produces `"Jun 20"` (month before day) without any manual reordering,
 * which happens to match the wireframe's own (locale-atypical outside the
 * US) date order exactly.
 */
export function formatMonthDay(isoDate: string): string {
  const date = new Date(isoDate);
  // See `formatDate.ts` for why `isNaN` (global), not `Number.isNaN`.
  if (isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
