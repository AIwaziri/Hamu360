/**
 * Formats an ISO 8601 date string as `"Jun 2026"` — month and year, no day.
 * The one place this is needed today is `NewJoinersWidget`'s `.jbadge`
 * (wireframe: `"Jun 2026"`), which is deliberately coarser than the exact
 * `joinDate` the mock/real List stores — see that widget's own docblock for
 * why day-level precision isn't surfaced in the UI even though the model
 * carries it.
 */
export function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  // See `formatDate.ts` for why `isNaN` (global), not `Number.isNaN`.
  if (isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
