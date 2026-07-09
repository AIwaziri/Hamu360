import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { IAnnouncement } from '@models/index';

import type { IAnnouncementsService } from '../IAnnouncementsService';
import { getSp } from './spClient';

const LIST_TITLE = 'Announcements';

/** Only the columns `IAnnouncement` needs — narrower selects are cheaper and make a schema drift (a renamed/removed column) fail loudly instead of silently returning `undefined`. */
interface IAnnouncementListItem {
  Id: number;
  Title: string;
  Body: string;
  Author: string;
  PublishDate: string;
  Pinned: boolean;
}

/**
 * Real implementation, backed by the "Announcements" SharePoint List
 * (`IAnnouncement`'s docblock: Title/Body/Author/PublishDate/Pinned,
 * versioning enabled, 4 seed rows). A straight field-for-field read — no
 * reshaping needed here beyond `Id` → `id` (stringified, matching every
 * other model's `id: string`), because `IAnnouncement` was deliberately
 * designed in Sprint 3 to mirror this List's columns 1:1.
 *
 * ## Checklist Item #2 — `Pinned` is read directly, not inferred
 *
 * `MockAnnouncementsService.pinned` was a *position-inferred guess*
 * (Sprint 3's docblock: "an inference from position, not a confirmed
 * value"). This implementation has no equivalent guess anywhere — `Pinned`
 * is selected and returned exactly as the live List's `Pinned` column
 * value, whatever that is for each row, including the possibility that
 * zero rows (or more than one) are pinned. `AnnouncementsFeed`'s own
 * pinned-first sort logic is unchanged and doesn't need to be — it already
 * operates on whatever `pinned` value each `IAnnouncement` carries, mock or
 * real.
 */
export class SharePointAnnouncementsService implements IAnnouncementsService {
  public constructor(private readonly context: WebPartContext) {}

  public async getAnnouncements(): Promise<IAnnouncement[]> {
    const sp = getSp(this.context);
    const items: IAnnouncementListItem[] = await sp.web.lists
      .getByTitle(LIST_TITLE)
      .items.select('Id', 'Title', 'Body', 'Author', 'PublishDate', 'Pinned')();

    return items.map(
      (item): IAnnouncement => ({
        id: item.Id.toString(),
        title: item.Title,
        body: item.Body,
        author: item.Author,
        publishDate: item.PublishDate,
        pinned: item.Pinned
      })
    );
  }
}
