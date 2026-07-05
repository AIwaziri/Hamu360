import type { IEvent } from '@models/index';

export interface IEventsWidgetProps {
  /** Every event the caller has (unsorted, untrimmed) — this component does the "next 4, soonest first" selection itself. See its own docblock. */
  events: IEvent[];
  className?: string;
}
