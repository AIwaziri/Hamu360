import type { IFirmWin } from '@models/index';

/**
 * Returns every firm win the caller is allowed to see, unsorted and
 * untrimmed — "top 4, most recent first" is `FirmWinsWidget`'s own
 * presentation concern. Same reasoning as `IEventsService`/
 * `IRegulatoryUpdatesService`: the real "Firm Wins" List has a "Default"
 * view, so the component owns ordering, not this service.
 */
export interface IFirmWinsService {
  getFirmWins(): Promise<IFirmWin[]>;
}
