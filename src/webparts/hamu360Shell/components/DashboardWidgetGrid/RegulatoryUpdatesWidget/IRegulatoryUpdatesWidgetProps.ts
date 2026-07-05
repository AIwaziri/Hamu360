import type { IRegulatoryUpdate } from '@models/index';

export interface IRegulatoryUpdatesWidgetProps {
  /** Every regulatory update the caller has (unsorted, untrimmed) — this component does the "top 4, most recent first" selection itself. See its own docblock. */
  regulatoryUpdates: IRegulatoryUpdate[];
  className?: string;
}
