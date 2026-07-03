import type { Nullable } from '@types/common';

/**
 * Joins CSS module class names, filtering out falsy values so callers can
 * write conditional classes inline without template-literal gymnastics:
 *   classNames(styles.card, isActive && styles.cardActive)
 */
export function classNames(...values: Array<Nullable<string> | false>): string {
  return values.filter((value): value is string => Boolean(value)).join(' ');
}
