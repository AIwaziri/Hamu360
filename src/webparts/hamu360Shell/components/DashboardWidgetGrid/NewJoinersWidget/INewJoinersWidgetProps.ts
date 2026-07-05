import type { INewJoiner } from '@models/index';

export interface INewJoinersWidgetProps {
  /**
   * Already scoped to whatever "recent" window the real List's "90-Day
   * filtered view" defines (see `INewJoinersService`'s docblock) — this
   * component does NOT re-filter by date, and renders every item it's
   * given in the order it's given. Contrast with `IEventsWidgetProps.events`
   * and the other three widgets' props, which are explicitly "unsorted,
   * untrimmed, do your own selection".
   */
  newJoiners: INewJoiner[];
  className?: string;
}
