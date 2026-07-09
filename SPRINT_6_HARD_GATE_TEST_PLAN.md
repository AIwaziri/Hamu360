# Sprint 6 Hard Gate — Manual Test Plan

## Why this document exists instead of a pass/fail result

Sprint 6's brief sets a hard gate: prove that the Managing Partner (MP) Command Centre destination denies access by its own SharePoint/Graph permissions, independently of whether its tile is visible in this SPFx page — "tile-hiding is NOT sufficient." Proving that requires a deployed site, a real Entra tenant with the `SG-HOS-AllStaff` and `SG-HOS-ManagingPartner` security groups actually provisioned, and two real test accounts, one in each group. None of those exist in this sandboxed build environment.

Per this sprint's own explicit sign-off (`AskUserQuestion`, at the start of this sprint, option selected: "Build all code + a manual test plan for someone with tenant access"), the code required for this gate to be testable has been built and is described below, and this document is the exact, ready-to-run procedure for whoever has tenant access to execute it. **Sprint 6 is not being marked complete against this gate until that person runs this plan and attaches the resulting evidence to `SPRINT_6_INTEGRATION_CHECKLIST.md` item 4.**

## What this codebase does and does not control

This SPFx solution controls exactly one thing relevant to this gate: whether the MP Command Centre tile is _rendered_ on the Home page, via `HubCardGrid`/`HubCard`'s existing `userGroups.indexOf(tile.requiredGroup) !== -1` check (unchanged since Sprint 4) fed by `GraphAudienceService.getUserGroups()` (new this sprint, fails closed to `['SG-HOS-AllStaff']` on any error — see `SPRINT_6_INTEGRATION_CHECKLIST.md` item 3's file for the implementation).

It does **not** control, and has no code path that could control, whatever access rule actually protects the MP Command Centre's destination site/page/list — that is a separate SharePoint/Graph permission object (a site permission, a unique-permissioned library, a security-group-scoped page audience, etc.) owned and configured outside this repository. This test plan exists specifically to confirm that separate control is real, not to exercise anything in this codebase a second time.

## Prerequisites

- The Sprint 6 build deployed to a real SharePoint site (`gulp build`/`eslint`/`prettier` all pass clean in this sandbox as of the Sprint 6 closeout — `@pnp/sp`'s earlier missing-registry-access blocker has since resolved — so this is now a normal deploy, not blocked on a dependency install elsewhere).
- Two test accounts in Entra ID:
  - **Account A** — member of `SG-HOS-AllStaff` only (or whatever the tenant's real equivalent group name turns out to be — see checklist item 3).
  - **Account B** — member of `SG-HOS-ManagingPartner` (and, transitively or explicitly, `SG-HOS-AllStaff`).
- The MP Command Centre destination's actual URL.

## Test steps

### Step 1 — Account A (AllStaff-only), direct URL navigation

1. Sign in to the tenant as Account A.
2. Navigate directly to the MP Command Centre destination URL — do not go through the Hamu360 Home page or click any tile.
3. **Expected result:** SharePoint/Graph itself denies access (an "Access Denied" page, a 403, or a redirect to a request-access flow) — not merely "the tile wasn't visible somewhere else."
4. **If Account A can open the page:** this is a **FAIL**. The destination has no independent permission boundary, and hiding its tile from other users is cosmetic only. This must be fixed at the destination (its own site/library/page permissions), not in this SPFx solution — there is nothing in this codebase that can compensate for a destination with no real access control.

### Step 2 — Account A, regression check on the tile itself

1. Still signed in as Account A, load the Hamu360 Home page.
2. **Expected result:** the MP Command Centre tile does not appear in the Team Hub Cards row at all.
3. This confirms Sprint 4's existing audience-filtering behavior still works correctly now that it's fed by real Graph data (`GraphAudienceService`) instead of `MockAudienceService` — a regression check, not a new capability.

### Step 3 — Account B (Managing Partner), tile visibility and destination access

1. Sign in to the tenant as Account B.
2. Load the Hamu360 Home page. **Expected result:** the MP Command Centre tile appears in the Team Hub Cards row.
3. Click the tile (or navigate directly to the same URL used in Step 1). **Expected result:** the destination loads successfully.

## Evidence to capture

For each of the three steps above: a screenshot showing the signed-in account (top-right user menu or equivalent) together with the page result (the access-denied page, the Home page's tile grid, or the loaded destination). Screen recordings are acceptable in place of screenshots. Attach all three to `SPRINT_6_INTEGRATION_CHECKLIST.md` item 4 once captured, and update that item's status from DEFERRED to PASS or FAIL accordingly.

## What a FAIL here means

If Step 1 fails (Account A can reach the destination directly), the fix is entirely outside this SPFx codebase — it lives in whatever system hosts the MP Command Centre destination. This test plan's job is to surface that gap clearly and early, not to work around it: per the brief, tile-hiding was never meant to be treated as a security boundary, and this plan exists precisely to stop that assumption from reaching production unverified.
