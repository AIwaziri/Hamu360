import type { WebPartContext } from '@microsoft/sp-webpart-base';

import { MANAGING_PARTNER_EMAIL } from '@config/people';
import type { IPartnerMessage } from '@models/index';
import { getInitials } from '@utils/index';

import type { IPartnerMessageService } from '../IPartnerMessageService';
import { getSp } from './spClient';

const SITE_PAGES_LIBRARY_TITLE = 'Site Pages';
/** SharePoint's internal value for "this page has been promoted as a News post." */
const PROMOTED_STATE_NEWS = 2;

// `| null` below models SharePoint REST's actual wire shape for an empty
// field (see `SharePointEventsService`'s docblock for the full rationale
// and the `@rushstack/no-new-null` precedent this follows).
interface ISitePageNewsItem {
  Id: number;
  Title: string;
  // eslint-disable-next-line @rushstack/no-new-null
  Description: string | null;
  FirstPublishedDate: string;
  // eslint-disable-next-line @rushstack/no-new-null
  Author: { Title: string; EMail: string } | null;
}

/**
 * Real implementation, backed by SharePoint's News feature
 * (`HOS_Documentation_v1.md` §3.1: "a News web part with a featured post
 * from Fali's account") rather than a custom List — this is the one Sprint
 * 6 service with no List schema to mirror 1:1, exactly as `IPartnerMessage`
 * anticipated back in Sprint 3.
 *
 * ## Sprint 6 closeout: the author filter this file's Sprint 6 docblock
 * flagged as missing is now applied
 *
 * Sprint 6 shipped this service picking the single most-recently-published
 * News post *site-wide*, with no author check — flagged at the time as a
 * real, unresolved risk ("an unrelated department's News post can
 * accidentally become 'the' Home page message"). That risk is now closed:
 * the query filters on `Author/EMail eq '${MANAGING_PARTNER_EMAIL}'` in
 * addition to `PromotedState eq 2`, so only a News post actually authored by
 * the Managing Partner's own account can ever populate this card. See
 * `@config/people.ts` for the identity constant itself and — importantly —
 * for why that value is a documented, unconfirmed inference rather than a
 * verified fact the way `@config/groups.ts`'s security group names are.
 *
 * `Author/EMail` (a SharePoint Person field's expanded email/UPN), not
 * `Author/Title` (display name) or an Entra object ID, is the match key —
 * see `@config/people.ts`'s docblock for the full reasoning on that choice
 * and the one-line swap to `AuthorId eq <id>` if IT Admin later supplies a
 * stable ID instead.
 *
 * ## No recency window is applied — a deliberate default, not an oversight
 *
 * No SharePoint News web part convention or Hamu Legal document anywhere in
 * this repo defines "how old is too old" for a featured post — there is no
 * "weekly" cutoff configured anywhere for the real News web part this
 * mirrors. Per this fix's own brief, the fallback when no such signal
 * exists is "most recent post from her regardless of age," which is exactly
 * what `orderBy('FirstPublishedDate', false).top(1)` (unchanged from
 * Sprint 6) already does once the author filter narrows the candidate set
 * to her own posts. The practical effect: if she posted three weeks ago and
 * nothing since, that three-week-old post is still shown — never blanked
 * out purely due to age. `EmptyState` (see below) is reserved for the case
 * where her account has **never** published a promoted News post, not for
 * "her latest one is stale."
 *
 * ## `undefined` return — "no message this week" vs. a failed fetch
 *
 * Per `IPartnerMessageService`'s updated docblock, this method returns
 * `undefined` (rather than throwing, and rather than fabricating a
 * placeholder `IPartnerMessage`) when the filtered query returns zero rows
 * — a real, expected state distinct from a rejected request. `HeroSection`
 * is the one place that turns this into UI: it renders the existing
 * `EmptyState` component ("No message from Fali this week") instead of
 * `PartnerMessageCard` when this resolves to `undefined`. `PartnerMessageCard`
 * itself is unchanged — its props/interface still require a real,
 * always-fully-populated `IPartnerMessage`, exactly as before.
 *
 * ## Everything below is unchanged from Sprint 6
 *
 * The remaining judgment call this file's Sprint 6 docblock raised —
 * whether production's real Home page renders this card as a genuine native
 * News web part per ADR-005's hybrid architecture, making this whole
 * component/service pair unused in production — is **not** resolved by this
 * fix and remains open, pending a decision from whoever owns the native
 * page layout.
 *
 * ## Field mapping compromises (unchanged from Sprint 6)
 *
 * - `message` reads the page's `Description` (a short plain-text summary
 *   SharePoint already extracts for promoted pages), not the full rich-text
 *   page body (`CanvasContent1`) — parsing that HTML canvas would need an
 *   HTML sanitizer/parser this project has no dependency on yet.
 * - `authorRole` has no source field on a Site Page at all — hardcoded here
 *   as a placeholder pending either a SharePoint User Profile lookup or a
 *   firm-confirmed constant.
 * - `authorInitials` is derived via the same shared `getInitials` util
 *   `NewJoinersWidget`/`Header` already use, not a separate guess.
 * - `authorPreferredName` is left `undefined` — `PartnerMessageCard`'s
 *   existing fallback (first word of `authorName`) already produces "Fali"
 *   from "Saadatu Hamu Aliyu" correctly.
 */
export class SharePointPartnerMessageService implements IPartnerMessageService {
  public constructor(private readonly context: WebPartContext) {}

  public async getPartnerMessage(): Promise<IPartnerMessage | undefined> {
    const sp = getSp(this.context);
    const [item] = await sp.web.lists
      .getByTitle(SITE_PAGES_LIBRARY_TITLE)
      .items.select('Id', 'Title', 'Description', 'FirstPublishedDate', 'Author/Title', 'Author/EMail')
      .expand('Author')
      .filter(`PromotedState eq ${PROMOTED_STATE_NEWS} and Author/EMail eq '${MANAGING_PARTNER_EMAIL}'`)
      .orderBy('FirstPublishedDate', false)
      .top(1)<ISitePageNewsItem[]>();

    if (!item) {
      // No promoted News post from her account exists (yet) — a real,
      // expected state, not an error. See this file's docblock: `HeroSection`
      // renders `EmptyState` for this, and this is never treated as a
      // `failedSections` entry by `Hamu360ShellWebPart.onInit()`.
      return undefined;
    }

    const authorName = item.Author?.Title ?? 'Unknown';

    return {
      id: item.Id.toString(),
      authorName,
      // See this file's docblock — no real source field for this yet.
      authorRole: 'Managing Partner',
      authorInitials: getInitials(authorName),
      message: item.Description ?? '',
      publishedDate: item.FirstPublishedDate
    };
  }
}
