export interface IEventDateParts {
  /** Day-of-month, no leading zero — e.g. `"1"`, `"14"`. */
  day: string;
  /** Three-letter, upper-case month abbreviation — e.g. `"JUL"`. */
  month: string;
}

/**
 * Splits an ISO 8601 date string into the two independent pieces
 * `EventsWidget`'s date-box renders on separate lines (wireframe `.ev-d`
 * "1" / `.ev-m` "JUL", stacked). Kept as its own small utility, the same
 * "one file per date-shaping concern" precedent as `formatDate.ts`,
 * `formatMonthDay.ts`, and `formatMonthYear.ts`, rather than a
 * string-splitting hack inside the component.
 */
export function formatEventDateParts(isoDate: string): IEventDateParts {
  const date = new Date(isoDate);
  // See `formatDate.ts` for why `isNaN` (global), not `Number.isNaN`.
  if (isNaN(date.getTime())) {
    return { day: '', month: '' };
  }
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  };
}
