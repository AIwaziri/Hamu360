import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IEvent } from '@models/index';

import type { IEventsService } from '../IEventsService';
import { getSp } from './spClient';

const LIST_TITLE = 'Events';

// `| null` below models SharePoint REST's actual wire shape for an empty
// field (it serializes as JSON `null`, not an absent key) — the same
// "describing a legacy/external API" escape hatch `@rushstack/no-new-null`
// allows for, already established in `src/types/common.ts`'s `Nullable<T>`.
// `IEvent` itself stays `| undefined`, matching the rest of this codebase's
// internal convention; the `null` -> `undefined` normalization happens once,
// in this file's `.map()` below.
interface IEventListItem {
  Id: number;
  Title: string;
  StartDate: string;
  // eslint-disable-next-line @rushstack/no-new-null
  EndDate: string | null;
  // eslint-disable-next-line @rushstack/no-new-null
  Location: string | null;
  /** SharePoint multi-value People/Group or Choice field renders as `{ results: string[] }` over REST — see this file's docblock. */
  // eslint-disable-next-line @rushstack/no-new-null
  Audience: { results: string[] } | null;
}

/**
 * Real implementation, backed by the "Events" SharePoint List (`IEvent`'s
 * docblock: Title/StartDate/EndDate/Location/Audience, 4 seed rows, no
 * server-side sort/filter — a "Default" view per
 * `HOS_Platform_Readiness_Gate_v1.md` §3.4). `EventsWidget`'s own
 * ascending-sort-and-slice logic is unchanged: this service returns every
 * row, unsorted, exactly as its interface always promised.
 *
 * `Audience` is the one field here needing a real shape decision `IEvent`'s
 * Sprint 5 docblock only speculated about ("same shape as
 * `IAudienceService.getUserGroups()`", i.e. `string[]`). A SharePoint
 * multi-value column (whether Person/Group or Choice) serializes over REST
 * as `{ results: [...] }`, not a bare array — this is exactly the kind of
 * real-API-shape mismatch this sprint's brief asked to be called out
 * explicitly. The reshape happens entirely here (`.Audience.results ?? []`);
 * `IEvent.audience` itself stays `string[] | undefined` and `EventsWidget`
 * (which never reads this field regardless — see `IEvent`'s docblock) needs
 * no change either way.
 */
export class SharePointEventsService implements IEventsService {
  public constructor(private readonly context: WebPartContext) {}

  public async getEvents(): Promise<IEvent[]> {
    const sp = getSp(this.context);
    const items: IEventListItem[] = await sp.web.lists
      .getByTitle(LIST_TITLE)
      .items.select('Id', 'Title', 'StartDate', 'EndDate', 'Location', 'Audience')();

    return items.map(
      (item): IEvent => ({
        id: item.Id.toString(),
        title: item.Title,
        startDate: item.StartDate,
        endDate: item.EndDate ?? undefined,
        location: item.Location ?? '',
        audience: item.Audience?.results ?? undefined
      })
    );
  }
}
