/**
 * Formats an ISO 8601 date string as `"24 Jun 2026"` — the one date display
 * format Sprint 3's Hero components need (`PartnerMessageCard`,
 * `AnnouncementsFeed`). Centralized here rather than duplicated in both,
 * per the same "generic utility, no business meaning" rule as everything
 * else in `src/utils`.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  // `Number.isNaN` isn't in this project's `tsconfig.json` `lib` set (see
  // its own comment: `es2017.object` is the only ES2015+ addition, added
  // specifically for `Object.entries`/`values`, not the full ES2015 core
  // lib) — the global `isNaN` is the ES5-safe equivalent for this one check.
  if (isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
