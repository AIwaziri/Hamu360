import type { IPartnerMessage } from '@models/index';

/**
 * Same "interface first, concrete implementation swapped by `ServiceFactory`"
 * shape as `ICurrentUserService`. `ServiceFactory.ts`'s
 * `createPartnerMessageService` chooses between `MockPartnerMessageService`
 * and `SharePointPartnerMessageService` (backed by the SharePoint News API).
 *
 * ## Why `| undefined`, added in the Sprint 6 closeout
 *
 * "No message from the Managing Partner right now" is a real, expected
 * state — not every week necessarily has a fresh News post from her account
 * — and is a materially different situation from a failed network call
 * (which `Hamu360ShellWebPart.onInit()` already handles separately via
 * `Promise.allSettled` and `failedSections`). Modeling "no message" as
 * `undefined` rather than throwing, or rather than fabricating a
 * placeholder `IPartnerMessage`, lets the one caller that needs to make a
 * rendering decision about it (`HeroSection`) do so with a plain, typed
 * `if (partnerMessage)` check instead of inspecting a sentinel field on an
 * otherwise-real-looking object. `MockPartnerMessageService` is unaffected
 * — a method typed to return `Promise<IPartnerMessage>` already satisfies
 * this narrower interface.
 */
export interface IPartnerMessageService {
  getPartnerMessage(): Promise<IPartnerMessage | undefined>;
}
