/**
 * Named individuals this codebase needs to identify by account, rather than
 * by group membership (`groups.ts`) or role label alone. Today this holds
 * exactly one entry — the Managing Partner's account, used by
 * `SharePointPartnerMessageService` to confirm a News post was actually
 * authored by her before rendering it as "Message from Fali", never an
 * unrelated site-wide post that merely happens to be the most recent.
 *
 * ## This value is NOT confirmed the way `groups.ts`'s are
 *
 * `groups.ts`'s `SG-HOS-*` constants are transcribed verbatim from
 * `HOS_Platform_Readiness_Gate_v1.md` — a document that states those exact
 * group names were created and populated in the real tenant. No equivalent
 * document exists anywhere in this repo naming Saadatu Hamu Aliyu's real
 * UPN/email. The value below is **inferred**, following the one naming
 * convention this codebase has actually observed
 * (`MockCurrentUserService`'s `firstname.lastname@hamulegal.com` pattern,
 * itself modeling a real Hamu Legal account), not copied from a confirmed
 * source. Treat this as a placeholder that must be verified — and corrected
 * here if wrong — by IT Admin against the real tenant before this filter is
 * trusted in production. Get this wrong and the author filter either matches
 * nothing (the card always shows the empty state, even when she has posted)
 * or — if some other real account happens to share the guessed address —
 * matches the wrong person, which is exactly the failure mode this fix
 * exists to prevent. Confirming it is a two-minute Entra/Exchange lookup;
 * guessing wrong here is a correctness bug, not a missing-feature gap, so it
 * is called out this explicitly rather than left as a quiet assumption
 * buried in `SharePointPartnerMessageService.ts`.
 *
 * `EMail` (not a display name, and not an Entra object ID — no ID is
 * documented anywhere for this account either) is used as the match key
 * because it is what SharePoint's `Author` Person field exposes over REST
 * without an extra Graph call, and because — unlike `displayName` — it is
 * not something a firm's own branding/nickname conventions ("Fali") would
 * ever cause to drift out of sync with what a filter needs to match exactly.
 * If IT Admin has the account's Entra object ID or SharePoint user ID handy,
 * filtering by `AuthorId eq <id>` instead would be strictly more robust
 * (immune to a future email/UPN change) — swapping to it is a one-line
 * change in `SharePointPartnerMessageService.ts`'s `.filter()` call plus
 * this constant, not a redesign.
 */
export const MANAGING_PARTNER_EMAIL = 'saadatu.aliyu@hamulegal.com';
