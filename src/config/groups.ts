/**
 * Real SG-HOS-* security group names, verbatim from the Platform Readiness
 * Gate (`HOS_Platform_Readiness_Gate_v1.md`, sections 3.1 "11 SG-HOS-*
 * security groups created and populated" and 3.2's authorization table,
 * which lists `SG-HOS-AllStaff` against the Home page and
 * `SG-HOS-ManagingPartner` against the MP Command Centre by name) — not
 * invented identifiers.
 *
 * `MockAudienceService`'s seed data and every `IHubTileConfig.requiredGroup`
 * value reference these constants rather than repeating the literal
 * strings, so a typo in one place is a compile error everywhere else
 * instead of a silent mismatch that would fail open or closed unnoticed —
 * exactly the kind of mistake that matters most on the one gate this
 * sprint exists to get right.
 */
export const SG_HOS_ALL_STAFF = 'SG-HOS-AllStaff';
export const SG_HOS_MANAGING_PARTNER = 'SG-HOS-ManagingPartner';
