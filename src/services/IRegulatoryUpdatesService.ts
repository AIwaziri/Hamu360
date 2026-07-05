import type { IRegulatoryUpdate } from '@models/index';

/**
 * Returns every regulatory update the caller is allowed to see, unsorted and
 * untrimmed — "top 4, most recent first" is `RegulatoryUpdatesWidget`'s own
 * presentation concern. Same reasoning as `IEventsService`: the real
 * "Regulatory Updates" List has a "Default" view (no server-side sort/filter
 * configured), so the component owns ordering, not this service.
 */
export interface IRegulatoryUpdatesService {
  getRegulatoryUpdates(): Promise<IRegulatoryUpdate[]>;
}
