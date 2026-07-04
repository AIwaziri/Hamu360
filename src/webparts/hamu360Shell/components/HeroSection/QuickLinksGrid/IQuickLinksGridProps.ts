import type { IQuickLink } from '@models/index';

export interface IQuickLinksGridProps {
  /** Every quick link the caller has (unsorted) — this component sorts by `sortOrder` itself. See its own docblock. */
  items: IQuickLink[];
  className?: string;
}
