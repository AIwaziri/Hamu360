import type { WebPartContext } from '@microsoft/sp-webpart-base';

import type { INewJoiner } from '@models/index';

import type { INewJoinersService } from '../INewJoinersService';
import { getSp } from './spClient';

const LIST_TITLE = 'Employee Onboarding';
const VIEW_TITLE = '90-Day filtered view';

interface INewJoinerListItem {
  Id: number;
  Title: string;
  Department: string;
  // `| null` models SharePoint REST's actual wire shape for an empty field
  // (see `SharePointEventsService`'s docblock for the full rationale and
  // the `@rushstack/no-new-null` precedent this follows).
  // eslint-disable-next-line @rushstack/no-new-null
  Role: string | null;
  JoinDate: string;
}

interface IViewQueryItem {
  ViewQuery: string;
}

/**
 * Real implementation, backed by the "Employee Onboarding" SharePoint List
 * — the only one of Sprint 5/6's Lists with a dedicated, named view rather
 * than "Default" (`HOS_Platform_Readiness_Gate_v1.md` §3.4: "90-Day
 * filtered view"). `NewJoinersWidget`'s own docblock (Sprint 5) already
 * committed to trusting its input completely, with no client-side date
 * filter of its own — this class is what makes that trust correct.
 *
 * ## Checklist Item #6 — querying *through* the view, not reimplementing its filter
 *
 * This does NOT run `items.filter(...)` against a hand-written "join date
 * within the last 90 days" predicate. It reads the view's own configured
 * CAML `<Where>` clause (`views.getByTitle(VIEW_TITLE).select('ViewQuery')`)
 * and re-submits that exact clause via `getItemsByCAMLQuery` — whatever
 * window the view is actually configured for (90 days today; if someone
 * changes it to 60 in the SharePoint UI tomorrow, this code changes
 * behavior automatically, with zero code deploy) is the window this method
 * honors. This is the literal meaning of "query through the view" the
 * brief asked for, not an approximation of it: there is exactly one place
 * "how recent counts as recent" is defined — the view itself — and this
 * service is not a second one.
 *
 * `avatarVariant` (the "IT Admin" row's navy/gold override in the wireframe
 * seed data) has no equivalent real List column — see `INewJoiner`'s own
 * docblock, which already documents this as presentation-only, not List
 * data. It's intentionally omitted here (left `undefined`, `NewJoinersWidget`'s
 * existing default), since there's no real signal to set it from; the
 * wireframe's one-off styling choice for that specific mock row doesn't
 * generalize to "make some real future joiner's avatar navy/gold" without
 * a List column this sprint has no basis to invent.
 */
export class SharePointNewJoinersService implements INewJoinersService {
  public constructor(private readonly context: WebPartContext) {}

  public async getNewJoiners(): Promise<INewJoiner[]> {
    const sp = getSp(this.context);
    const list = sp.web.lists.getByTitle(LIST_TITLE);

    const view: IViewQueryItem = await list.views.getByTitle(VIEW_TITLE).select('ViewQuery')();

    const viewXml = `
      <View>
        <Query>${view.ViewQuery}</Query>
        <ViewFields>
          <FieldRef Name="Title" />
          <FieldRef Name="Department" />
          <FieldRef Name="Role" />
          <FieldRef Name="JoinDate" />
        </ViewFields>
      </View>
    `;

    const items: INewJoinerListItem[] = await list.getItemsByCAMLQuery({ ViewXml: viewXml });

    return items.map(
      (item): INewJoiner => ({
        id: item.Id.toString(),
        name: item.Title,
        department: item.Department,
        role: item.Role ?? undefined,
        joinDate: item.JoinDate
      })
    );
  }
}
