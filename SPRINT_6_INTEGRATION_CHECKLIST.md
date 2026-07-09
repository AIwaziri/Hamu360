# Sprint 6 Integration Checklist

This is the mandatory, explicit verification record for the six items Sprint 6's brief flagged as assumptions made in Sprints 2–5 that needed confirming against real data once live services replaced mock ones. Per the brief: this file must be committed with all six items checked, or explicitly noted failed/deferred with reasoning, before Sprint 6 sign-off.

**Sandbox constraint that shapes every item below:** this build environment has no live SharePoint tenant, no deployed site, no real Entra security groups, and no test accounts. (Sprint 6 originally also hit a blocked npm registry that prevented `@pnp/sp` from installing — that has since resolved and `gulp build`/`eslint`/`prettier` all pass clean as of the Sprint 6 closeout; see the closeout summary. It's called out here only because it was a real blocker at the time and is worth knowing it's no longer one.) Every item that can be resolved by reading/writing code has been resolved. Every item that requires an actual tenant round-trip is marked **DEFERRED** with the exact manual steps someone with tenant access needs to run, per this sprint's own sign-off (see `AskUserQuestion` exchange at the start of this sprint: "Build all code + a manual test plan for someone with tenant access").

---

## 1. Mock identity → real `context.pageContext.user` (Sprint 2)

**Status: PASS.**

`SharePointCurrentUserService` (built in an earlier sprint, unchanged this sprint) reads `context.pageContext.user` directly — `displayName`, `email`, `loginName`, and `id` all come from the real signed-in user's page context, not a hand-authored mock object. `ServiceFactory.createCurrentUserService()` now routes to it whenever `env.useMockData` is `false`. `Hamu360ShellWebPart.onInit()` treats a failure here as page-critical (see item 4's related architecture note) rather than falling back to a mock identity, so there is no code path where a real deployment silently shows placeholder identity data.

**Verification performed:** code read — `SharePointCurrentUserService.getCurrentUser()` has no mock/placeholder fallback of any kind; a rejected promise propagates to `onInit()`'s `catch`, which sets `pageStatus = 'error'` rather than substituting fake data.

---

## 2. Announcements' `Pinned` boolean — real List value, not position-inferred (Sprint 3)

**Status: PASS.**

`SharePointAnnouncementsService.getAnnouncements()` selects the List's own `Pinned` column directly (`.select('Id', 'Title', 'Body', 'Author', 'PublishDate', 'Pinned')`) and maps it straight through: `pinned: item.Pinned`. There is no positional logic ("first N items are pinned") anywhere in this file — that was `MockAnnouncementsService`'s Sprint 3 shortcut, and it has no equivalent here.

**Verification performed:** code read — confirmed no array-index or `.slice()`-based pin inference exists in `SharePointAnnouncementsService.ts`; `AnnouncementsFeed.tsx` (unchanged this sprint) already only ever reads the boolean field, never an index, so no downstream change was needed either.

---

## 3. Group-name string matching — real Graph `/me/memberOf` vs. `groups.ts` string values (Sprint 4)

**Status: DEFERRED — code complete, live verification requires a real tenant.**

`GraphAudienceService.getUserGroups()` calls `/me/memberOf`, filters to `@odata.type === '#microsoft.graph.group'` with `securityEnabled === true`, and returns each group's `displayName`. `HubCardGrid`/`HubCard`'s existing string-membership check (`userGroups.indexOf(tile.requiredGroup) !== -1`, unchanged since Sprint 4) depends entirely on those `displayName` strings matching `src/config/groups.ts`'s hardcoded values (`SG-HOS-AllStaff`, `SG-HOS-ManagingPartner`, etc.) **exactly** — same casing, same punctuation, no leading/trailing whitespace.

**What cannot be verified in this sandbox:** whether the _actual_ Entra security groups provisioned for Hamu Legal are named exactly `SG-HOS-ManagingPartner` (etc.), or something that differs in case, hyphenation, or wording. Graph's `displayName` is a free-text field an Entra admin sets; `groups.ts`'s constants are this codebase's own assumption about what that text will be. A mismatch here fails silently and safely (the user simply doesn't qualify for that tile — see item 4 below on why "silent" is acceptable for this specific field) but would still be a real bug worth catching before go-live.

**Manual verification required before production sign-off:**

1. In Entra admin center (or `Get-MgGroup`/Graph Explorer), list the exact `displayName` of every security group Sprint 4's `groups.ts` assumes exists.
2. Compare each one, character-for-character, against `src/config/groups.ts`'s exported constants.
3. Sign in to the deployed page as a member of each group and confirm the corresponding hub tile(s) appear — this exercises the match end-to-end, not just the raw string comparison.
4. If any name differs, fix `groups.ts` (a one-file change) rather than renaming the Entra group.

**Also worth flagging:** matching on `displayName` rather than a stable identifier (object ID) is fragile to a future rename of the group in Entra — noted in `GraphAudienceService`'s own docblock as a known trade-off, not fixed this sprint (fixing it would mean `groups.ts` storing GUIDs instead of readable names, a larger change than this sprint's scope).

---

## 4. MP Command Centre destination independently enforces access (Sprint 4) — HARD GATE

**Status: DEFERRED — see the separate Hard Gate manual test plan.**

This is the sprint's explicit hard gate and is tracked in its own document: `SPRINT_6_HARD_GATE_TEST_PLAN.md`. Summary: `GraphAudienceService` failing closed to `['SG-HOS-AllStaff']` on any error (verified by code read — see item 3's file, the `catch` block never returns an elevated group set) and `HubCardGrid` hiding the MP tile from non-MP users are both real, but **neither is a substitute for the destination itself enforcing access** — tile-hiding only controls what's discoverable through this UI, not what's reachable by a direct URL. This codebase has no visibility into, or control over, the MP Command Centre destination's own SharePoint/Graph permissions (it's a separate site/page/list this SPFx solution does not own or provision). No amount of code review in this sandbox can substitute for the three-step test described in the linked plan.

**Not marked complete. Per the brief: "Do not mark Sprint 6 complete without it."** — this checklist item, and the sprint as a whole, are being reported as incomplete against this specific requirement, with the reasoning above and a ready-to-run manual test plan, rather than a fabricated pass.

---

## 5. Firm Wins dates — real List value, not inferred (Sprint 5)

**Status: PASS.**

`SharePointFirmWinsService.getFirmWins()` reads the List's `Date` column directly (`date: item.Date`) with no fallback or inference — the wireframe never showed a date for this widget, so Sprint 5's mock data invented one; this service instead trusts whatever the real List contains, including the possibility of a genuinely empty/unset date on some rows (noted in the service's own docblock as a real, not-yet-observed edge case worth a second look once real data exists — `FirmWinsWidget`'s date rendering has no null-guard beyond what `IFirmWin.date` already allows).

**Verification performed:** code read — confirmed no `new Date()`/random-offset/index-based date generation exists anywhere in `SharePointFirmWinsService.ts`, unlike `MockFirmWinsService`'s Sprint 5 approach.

---

## 6. NewJoinersWidget queries through the existing "90-Day filtered view" (Sprint 5)

**Status: PASS.**

`SharePointNewJoinersService.getNewJoiners()` does not reimplement a 90-day predicate. It reads the SharePoint view's own configured CAML query (`list.views.getByTitle('90-Day filtered view').select('ViewQuery')`) and re-submits that exact `<Where>` clause via `getItemsByCAMLQuery`. There is exactly one place "how recent counts as recent" is defined — the view itself, per `HOS_Platform_Readiness_Gate_v1.md` §3.4 — and this service is not a second one. If an admin edits the view's date window in the SharePoint UI, this code's behavior changes automatically with no redeploy.

**Verification performed:** code read — confirmed the CAML query passed to `getItemsByCAMLQuery` is built from `view.ViewQuery` (the view's own stored query), not a hand-written date comparison; `NewJoinersWidget.tsx` itself remains unchanged from Sprint 5, still trusting its input completely with no client-side filter.

---

## Summary

| #   | Item                                                           | Status                                           |
| --- | -------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Mock identity → real `context.pageContext.user`                | PASS                                             |
| 2   | Announcements `Pinned` — real List value                       | PASS                                             |
| 3   | Group-name string matching — Graph vs. `groups.ts`             | DEFERRED (manual tenant verification required)   |
| 4   | MP Command Centre — real access enforcement (HARD GATE)        | DEFERRED (see `SPRINT_6_HARD_GATE_TEST_PLAN.md`) |
| 5   | Firm Wins dates — real List value                              | PASS                                             |
| 6   | NewJoinersWidget — queries through real "90-Day filtered view" | PASS                                             |

Four of six items are fully resolved and verified by code inspection. The remaining two (3 and 4) are the two items in the original brief that inherently require a live Entra tenant, a deployed site, and real test accounts to verify — none of which exist in this sandboxed build environment. Both have ready-to-execute manual test plans attached rather than being left as vague follow-ups, and per this sprint's own explicit scope agreement, Sprint 6 is not being reported as fully complete against the Hard Gate until someone with tenant access runs that plan and the evidence it produces is attached here.
