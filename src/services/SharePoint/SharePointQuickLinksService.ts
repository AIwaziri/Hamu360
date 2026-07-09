import type { WebPartContext } from '@microsoft/sp-webpart-base';

import { ICON_NAMES, type IconName } from '@components/Icon';
import type { IQuickLink } from '@models/index';

import type { IQuickLinksService } from '../IQuickLinksService';
import { getSp } from './spClient';

const LIST_TITLE = 'Quick Links';

interface IQuickLinkListItem {
  Id: number;
  Label: string;
  URL: string;
  Icon: string;
  SortOrder: number;
}

/**
 * Real implementation, backed by the "Quick Links" SharePoint List
 * (`IQuickLink`'s docblock: Label/URL/Icon/SortOrder, 8 seed rows).
 *
 * One genuine reshape, not just a rename: the List's `Icon` column is a
 * free-text SharePoint field (there is no way to constrain a SharePoint
 * text column to this app's closed `IconName` union at the List-schema
 * level), but `IQuickLink.icon` is typed as `IconName` specifically so a
 * List row referencing an icon this app doesn't render is impossible to
 * represent — see that model's own docblock. `toIconName` is the runtime
 * check that makes that compile-time guarantee actually hold, checking
 * against `ICON_NAMES` — the same array `IconName` itself is derived from
 * (see that file's docblock for why it's an array, not just a type) — so
 * this validation can never drift out of sync with the type as new icons
 * are added in future sprints. A List row whose `Icon` value isn't one of
 * this app's known glyphs falls back to `'bolt'` (Quick Links' own section
 * icon — a safe, always-defined default) rather than the whole
 * `QuickLinksGrid` render crashing on one bad row from a List column
 * nothing prevents someone from mistyping.
 */
function toIconName(rawIcon: string): IconName {
  return (ICON_NAMES as readonly string[]).indexOf(rawIcon) !== -1 ? (rawIcon as IconName) : 'bolt';
}

export class SharePointQuickLinksService implements IQuickLinksService {
  public constructor(private readonly context: WebPartContext) {}

  public async getQuickLinks(): Promise<IQuickLink[]> {
    const sp = getSp(this.context);
    const items: IQuickLinkListItem[] = await sp.web.lists
      .getByTitle(LIST_TITLE)
      .items.select('Id', 'Label', 'URL', 'Icon', 'SortOrder')();

    return items.map(
      (item): IQuickLink => ({
        id: item.Id.toString(),
        label: item.Label,
        url: item.URL,
        icon: toIconName(item.Icon),
        sortOrder: item.SortOrder
      })
    );
  }
}
