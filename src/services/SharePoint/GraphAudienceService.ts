import type { MSGraphClientV3 } from '@microsoft/sp-http';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

import { SG_HOS_ALL_STAFF } from '@config/groups';

import type { IAudienceService } from '../IAudienceService';

/** How long to wait for Graph before giving up and failing closed. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Graph's shape for a single item in a `/me/memberOf` page — only the fields this service reads. */
interface IGraphDirectoryObject {
  '@odata.type': string;
  displayName?: string;
  securityEnabled?: boolean;
}

interface IGraphMemberOfPage {
  value: IGraphDirectoryObject[];
  '@odata.nextLink'?: string;
}

/**
 * Real implementation of Checklist Item #4's non-negotiable half — the
 * *other* half (SharePoint/Graph independently enforcing the MP Command
 * Centre destination) lives entirely outside this codebase, in the
 * destination site's own permissions. See
 * `SPRINT_6_INTEGRATION_CHECKLIST.md` item 4 for why "this tile is hidden"
 * and "this destination is protected" are two separate, independently
 * necessary controls, and why only the second one is a hard gate this
 * service cannot satisfy by itself no matter how correct it is.
 *
 * ## Fail-closed, explicitly
 *
 * `getUserGroups()` NEVER rejects and NEVER returns anything broader than
 * `[SG_HOS_ALL_STAFF]` on failure — a Graph error, a consent/permission
 * problem, a malformed response, or a timeout (`REQUEST_TIMEOUT_MS`) all
 * collapse to the exact same least-privileged fallback
 * `MockAudienceService`'s default already established in Sprint 4. A
 * security gate that can't positively confirm elevated access must default
 * to denying it — the same posture `ServiceFactory.createAudienceService`'s
 * docblock describes, now enforced by real, adversarial conditions (a flaky
 * network, an expired token, a throttled tenant) instead of just "there's
 * no signal yet."
 *
 * ## Mapping Graph's response to `groups.ts`'s string constants — Checklist Item #3
 *
 * `/me/memberOf` returns `DirectoryObject`s, not display names. This maps
 * on `displayName` (after filtering to `@odata.type ===
 * '#microsoft.graph.group'` and `securityEnabled === true`, to exclude
 * directory roles and any non-security M365/distribution groups from the
 * result entirely) because `displayName` is the only field that can
 * naturally match `groups.ts`'s human-readable `'SG-HOS-AllStaff'`-style
 * constants without introducing a second configuration table mapping group
 * IDs to names. This is a real, load-bearing assumption: if IT Admin
 * renames a security group in Entra ID after this ships, this mapping
 * silently stops matching that group — a rename doesn't error, it just
 * quietly drops the user from that group's tiles. `groups.ts`'s exported
 * constants being the single source of truth for the *expected* strings
 * mitigates typos on this codebase's side, but cannot catch a rename made
 * entirely in Entra ID with no corresponding code change. Checklist Item #3
 * exists specifically to verify this mapping against the real tenant before
 * sign-off; if it fails, the fix is either "rename the Entra group back to
 * match" (fast) or "switch this mapping to group `id` plus a maintained
 * id-to-name lookup table" (a real follow-up sprint, not a one-line fix).
 *
 * Pagination (`@odata.nextLink`) is followed in full before returning —
 * an account belonging to more than one Graph page of groups must not have
 * its later-page memberships silently dropped, which could just as easily
 * hide a real elevated-access group as an irrelevant one.
 */
export class GraphAudienceService implements IAudienceService {
  public constructor(private readonly context: WebPartContext) {}

  public async getUserGroups(): Promise<string[]> {
    try {
      const groups = await withTimeout(this.fetchAllMemberOfGroups(), REQUEST_TIMEOUT_MS);
      // Belt-and-braces: even if every check above somehow let through zero
      // recognizable groups, every authenticated user is implicitly
      // SG-HOS-AllStaff — never return an empty array, which would deny a
      // legitimate staff member the Home page itself.
      return groups.indexOf(SG_HOS_ALL_STAFF) === -1 ? [...groups, SG_HOS_ALL_STAFF] : groups;
    } catch {
      // Every failure mode — network error, consent/permission error,
      // malformed response, or the timeout above — collapses to this one
      // fail-closed line. Deliberately no `console.error`/logging call
      // here: `enableDebugLogging` consumers can wrap this service, but the
      // contract itself must not have a side channel that could be mistaken
      // for a passing result.
      return [SG_HOS_ALL_STAFF];
    }
  }

  private async fetchAllMemberOfGroups(): Promise<string[]> {
    const client: MSGraphClientV3 = await this.context.msGraphClientFactory.getClient('3');
    const groupNames: string[] = [];
    // First page: a relative path, needs an explicit `.version()`. Every
    // subsequent page's `@odata.nextLink` is already a complete, absolute
    // URL with its own version segment — passing `.version()` again would
    // be redundant at best, so `isFirstPage` picks which call shape to use.
    let nextUrl: string | undefined = '/me/memberOf?$select=displayName,securityEnabled';
    let isFirstPage = true;

    // Pages must be fetched sequentially — page N+1's URL is only known
    // once page N's response has arrived — so this loop cannot be
    // parallelized into a single `Promise.all`.
    while (nextUrl) {
      const page: IGraphMemberOfPage = isFirstPage
        ? await client.api(nextUrl).version('v1.0').get()
        : await client.api(nextUrl).get();
      isFirstPage = false;

      for (const item of page.value) {
        if (item['@odata.type'] === '#microsoft.graph.group' && item.securityEnabled && item.displayName) {
          groupNames.push(item.displayName);
        }
      }

      nextUrl = page['@odata.nextLink'];
    }

    return groupNames;
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('GraphAudienceService: /me/memberOf timed out')), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
