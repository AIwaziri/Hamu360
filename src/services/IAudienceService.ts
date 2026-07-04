/**
 * Returns the current user's security group memberships as plain strings
 * (e.g. `['SG-HOS-AllStaff']` or `['SG-HOS-AllStaff', 'SG-HOS-ManagingPartner']`)
 * — nothing more specific than that. This is the ENTIRE contract between
 * "whatever decides who's in which group" and every component that gates
 * content on group membership (`HubCardGrid` today).
 *
 * That narrowness is deliberate: Sprint 6's real implementation
 * (`services/SharePoint/GraphAudienceService.ts` or similar) will call
 * Microsoft Graph's `/me/memberOf` and map the response down to this same
 * `string[]` of group names. Because the interface never leaks anything
 * Graph-specific (no `@odata.type`, no group IDs, no `DirectoryObject`
 * shapes) into the contract, that mapping is fully contained inside the
 * new service file — `HubCardGrid`, which only ever asks "does this
 * string[] include this one string", cannot tell the difference between a
 * mock array and a real Graph response, and never needs to change.
 */
export interface IAudienceService {
  getUserGroups(): Promise<string[]>;
}
