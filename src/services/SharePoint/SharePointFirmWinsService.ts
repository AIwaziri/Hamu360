import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IFirmWin } from '@models/index';

import type { IFirmWinsService } from '../IFirmWinsService';
import { getSp } from './spClient';

const LIST_TITLE = 'Firm Wins';

interface IFirmWinListItem {
  Id: number;
  Title: string;
  Category: string;
  Date: string;
}

/**
 * Real implementation, backed by the "Firm Wins" SharePoint List
 * (`IFirmWin`'s docblock: Title/Category/Date, versioning enabled, 4 seed
 * rows, a "Default" view). `FirmWinsWidget`'s own descending-sort-and-slice
 * logic is unchanged.
 *
 * ## Checklist Item #5 — `Date` is now a real column value, not an inference
 *
 * `MockFirmWinsService.date` was flagged as a genuine inference (the
 * wireframe never displays a date for this section at all — see that mock
 * file's docblock). This implementation has no equivalent guess: `Date` is
 * read directly from the live List's `Date` column. If that column turns
 * out to be empty/unset for some rows in the real List (plausible exactly
 * because the wireframe never surfaced this field, so data entry may not
 * have prioritized it), `FirmWinsWidget`'s sort will place those rows
 * according to whatever empty-string/epoch date `new Date('')` resolves to
 * — worth spot-checking against real data as part of this item's
 * sign-off, not assumed clean.
 *
 * `Category` is cast without runtime validation, same reasoning and same
 * caveat as `SharePointRegulatoryUpdatesService.practiceArea`.
 */
export class SharePointFirmWinsService implements IFirmWinsService {
  public constructor(private readonly context: WebPartContext) {}

  public async getFirmWins(): Promise<IFirmWin[]> {
    const sp = getSp(this.context);
    const items: IFirmWinListItem[] = await sp.web.lists
      .getByTitle(LIST_TITLE)
      .items.select('Id', 'Title', 'Category', 'Date')();

    return items.map(
      (item): IFirmWin => ({
        id: item.Id.toString(),
        title: item.Title,
        category: item.Category as IFirmWin['category'],
        date: item.Date
      })
    );
  }
}
