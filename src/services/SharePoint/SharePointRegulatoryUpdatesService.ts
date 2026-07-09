import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IRegulatoryUpdate } from '@models/index';

import type { IRegulatoryUpdatesService } from '../IRegulatoryUpdatesService';
import { getSp } from './spClient';

const LIST_TITLE = 'Regulatory Updates';

interface IRegulatoryUpdateListItem {
  Id: number;
  Title: string;
  Date: string;
  /** Choice column — REST returns the choice's text value directly (not `{ results: [...] }`, since this is single-value, unlike `Events.Audience`). */
  PracticeArea: string;
}

/**
 * Real implementation, backed by the "Regulatory Updates" SharePoint List
 * (`IRegulatoryUpdate`'s docblock: Title/Date/PracticeArea, 4 seed rows, a
 * "Default" view). `RegulatoryUpdatesWidget`'s own descending-sort-and-slice
 * logic is unchanged.
 *
 * `PracticeArea` is cast to `IRegulatoryUpdate.practiceArea`'s
 * `'CC' | 'GRC' | 'IP' | 'DR'` union without runtime validation, unlike
 * `SharePointQuickLinksService`'s `Icon` handling — a SharePoint Choice
 * column can only hold one of its configured choice values, which the List
 * schema itself (out of this codebase's control) already constrains to
 * these four workstream codes. Revisit this assumption if the List's choice
 * options are ever edited to add a fifth value without a matching code
 * change here.
 */
export class SharePointRegulatoryUpdatesService implements IRegulatoryUpdatesService {
  public constructor(private readonly context: WebPartContext) {}

  public async getRegulatoryUpdates(): Promise<IRegulatoryUpdate[]> {
    const sp = getSp(this.context);
    const items: IRegulatoryUpdateListItem[] = await sp.web.lists
      .getByTitle(LIST_TITLE)
      .items.select('Id', 'Title', 'Date', 'PracticeArea')();

    return items.map(
      (item): IRegulatoryUpdate => ({
        id: item.Id.toString(),
        title: item.Title,
        date: item.Date,
        practiceArea: item.PracticeArea as IRegulatoryUpdate['practiceArea']
      })
    );
  }
}
