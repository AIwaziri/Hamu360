import type { IEvent, IFirmWin, INewJoiner, IRegulatoryUpdate } from '@models/index';

export interface IDashboardWidgetGridProps {
  /** Unsorted, untrimmed — forwarded as-is to `EventsWidget`, which does its own "next 4" selection. */
  events: IEvent[];
  /** Already scoped to the real List's "90-Day filtered view" — forwarded as-is to `NewJoinersWidget`, which does not re-filter. See `INewJoinersService`'s docblock. */
  newJoiners: INewJoiner[];
  /** Unsorted, untrimmed — forwarded as-is to `RegulatoryUpdatesWidget`, which does its own "top 4" selection. */
  regulatoryUpdates: IRegulatoryUpdate[];
  /** Unsorted, untrimmed — forwarded as-is to `FirmWinsWidget`, which does its own "top 4" selection. */
  firmWins: IFirmWin[];
  className?: string;
}
