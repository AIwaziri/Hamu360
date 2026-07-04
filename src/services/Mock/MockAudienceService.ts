import { SG_HOS_ALL_STAFF } from '@config/groups';

import type { IAudienceService } from '../IAudienceService';

/**
 * Stand-in for a real Microsoft Graph `/me/memberOf` call. Deliberately
 * takes its group list via the constructor rather than hardcoding one
 * value — this is what lets `HeroSectionShowcase`'s successor,
 * `HubCardShowcase`, construct two different instances (one per toggle
 * state) to demonstrate the MP Command Centre tile appearing/disappearing,
 * without a single `isManagingPartner = true`-style boolean anywhere in
 * this codebase. There is exactly one class here — the "two identities"
 * the showcase demonstrates are two different arguments to the same
 * constructor, not two code paths.
 */
export class MockAudienceService implements IAudienceService {
  public constructor(private readonly groups: string[] = [SG_HOS_ALL_STAFF]) {}

  public async getUserGroups(): Promise<string[]> {
    return this.groups;
  }
}
