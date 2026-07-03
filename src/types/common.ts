/**
 * Generic, domain-agnostic utility types shared across the whole application.
 * Domain/business types belong in `src/models`, not here — this file must
 * stay free of anything specific to a feature.
 */

/**
 * A value that may legitimately be absent. Prefer this over sprinkling
 * `| undefined` everywhere.
 *
 * Includes `null` (not just `undefined`) deliberately: this models results
 * from existing DOM/React APIs that return `null` (e.g. `React.RefObject.current`),
 * which is exactly the escape hatch `@rushstack/no-new-null` allows for.
 */
// eslint-disable-next-line @rushstack/no-new-null
export type Nullable<T> = T | null | undefined;

/** Marks the given keys of `T` as optional while leaving the rest untouched. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Marks the given keys of `T` as required while leaving the rest untouched. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Discriminated-union representation of an async operation, for use in hooks/services. */
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };
