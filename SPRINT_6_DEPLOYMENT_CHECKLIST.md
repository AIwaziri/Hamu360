# Sprint 6 Real-Tenant Deployment Checklist

Everything code-related is done and verified in the sandbox (`gulp build`/`eslint`/`prettier` all pass clean). Everything below requires the real Hamu Legal tenant, real accounts, and real permissions — none of it can be done from this sandbox. This is the ordered punch list to take Sprint 6 from "code complete" to "signed off," written for IT Admin.

Target site (per `config/serve.json`): `https://hamulegal.sharepoint.com/sites/Hamu360/`.

---

## 1. Confirm the Managing Partner's identity (5 minutes, do this first)

`src/config/people.ts` currently holds an **inferred, unconfirmed** value:

```
MANAGING_PARTNER_EMAIL = 'saadatu.aliyu@hamulegal.com'
```

This was guessed from the firm's own `firstname.lastname@hamulegal.com` convention (already used elsewhere in this codebase), not copied from a confirmed source — there is no document anywhere in this repo stating Saadatu Hamu Aliyu's real UPN.

- [ ] Look up her real UPN/email in Entra admin center or Exchange admin.
- [ ] If it matches the guessed value, check this box and move on.
- [ ] If it doesn't match, update the constant in `src/config/people.ts` — this is the only file that needs to change.

Getting this wrong silently breaks the "Message from Fali" card (it always shows the empty state, or — worse — matches the wrong account) with no build error to catch it, so don't skip this step.

## 2. Confirm the SG-HOS-\* security group names (Checklist item 3)

`src/config/groups.ts` hardcodes two group names, transcribed from `HOS_Platform_Readiness_Gate_v1.md`:

```
SG_HOS_ALL_STAFF = 'SG-HOS-AllStaff'
SG_HOS_MANAGING_PARTNER = 'SG-HOS-ManagingPartner'
```

Only `SG-HOS-ManagingPartner` actually gates anything today — it's the one tile (`HUB_TILES`'s `mpCommandCentre` entry) with a `requiredGroup`. `SG-HOS-AllStaff` is the fail-closed default `GraphAudienceService` falls back to, not a group that hides anything.

- [ ] In Entra admin center, find the real security group that should gate the MP Command Centre tile.
- [ ] Compare its `displayName` character-for-character against `SG_HOS_MANAGING_PARTNER` above (Graph matches on `displayName`, not object ID — see `GraphAudienceService`'s docblock).
- [ ] If it differs, update `src/config/groups.ts` — one file, one constant.
- [ ] Confirm the Managing Partner's account is actually a member of that group.

This closes `SPRINT_6_INTEGRATION_CHECKLIST.md` item 3 — update that file's status once confirmed.

## 3. Provision the SharePoint Lists/libraries the services expect

Each service reads a specific List/library by title, with specific columns. If your tenant's real Lists use different names, the fix is a one-line constant change per service file — not a redesign — but they do need to exist with these names/columns for anything to render real data at all.

| Service                              | List/library title                            | Columns read                                                                       | Notes                                                                                                                                                                                                                                |
| ------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SharePointAnnouncementsService`     | `Announcements`                               | `Id`, `Title`, `Body`, `Author`, `PublishDate`, `Pinned`                           | `Pinned` must be a real Yes/No column — not inferred from row order.                                                                                                                                                                 |
| `SharePointQuickLinksService`        | `Quick Links`                                 | `Id`, `Label`, `URL`, `Icon`, `SortOrder`                                          | `Icon` is free text, validated against the app's own icon set at runtime — unrecognized values fall back to a generic icon rather than erroring.                                                                                     |
| `SharePointEventsService`            | `Events`                                      | `Id`, `Title`, `StartDate`, `EndDate`, `Location`, `Audience`                      | `Audience` (if used) must be a multi-value column — the service already handles SharePoint's `{results:[...]}` wire shape for it.                                                                                                    |
| `SharePointNewJoinersService`        | `Employee Onboarding`                         | `Id`, `Title`, `Department`, `Role`, `JoinDate`                                    | Requires a view literally named **`90-Day filtered view`** on this List — the service re-submits that view's own CAML query rather than reimplementing the date filter. If the view is renamed, update `VIEW_TITLE` in the service.  |
| `SharePointRegulatoryUpdatesService` | `Regulatory Updates`                          | `Id`, `Title`, `Date`, `PracticeArea`                                              | `PracticeArea` is trusted as-is (a Choice column) with no runtime validation.                                                                                                                                                        |
| `SharePointFirmWinsService`          | `Firm Wins`                                   | `Id`, `Title`, `Category`, `Date`                                                  |                                                                                                                                                                                                                                      |
| `SharePointPartnerMessageService`    | `Site Pages` (the library, not a custom List) | `Id`, `Title`, `Description`, `FirstPublishedDate`, `Author/Title`, `Author/EMail` | Reads real SharePoint News posts (`PromotedState eq 2`), filtered to the Managing Partner's account (step 1). Needs at least one real News post from her account promoted before it will render anything other than the empty state. |

- [ ] Confirm each List/library above exists with these exact titles, or note the discrepancy.
- [ ] Confirm each column above exists with a compatible type.
- [ ] Confirm the "90-Day filtered view" exists on Employee Onboarding.
- [ ] Publish at least one real News post from the Managing Partner's account (for step 1/4's identity to have something to find).

## 4. Deploy the package

- [ ] On a machine with normal npm registry access (this sandbox's earlier registry block has since resolved, but deploy from wherever your CI/build process normally runs): `npm install`, then `gulp bundle --ship`, then `gulp package-solution --ship`.
- [ ] Upload the resulting `.sppkg` (from `sharepoint/solution/`) to the tenant App Catalog.
- [ ] Add the app to `https://hamulegal.sharepoint.com/sites/Hamu360/`.
- [ ] Confirm the web part renders and reaches `pageStatus: 'ready'` for a normal signed-in account — if it stalls on the loading skeleton or shows the page-critical error, `currentUser` (via `context.pageContext.user`) is the first thing to check.

## 5. Provision the two Hard Gate test accounts (Checklist item 4)

- [ ] **Account A**: member of `SG-HOS-AllStaff` (or its real tenant equivalent per step 2) only.
- [ ] **Account B**: member of `SG-HOS-ManagingPartner` (real equivalent), and confirm it can also reach whatever destination the MP Command Centre tile links to.
- [ ] Confirm that destination's own SharePoint/Graph permissions are configured to deny Account A and allow Account B — **before** running the test below. If the destination has no independent permission boundary configured yet, configure it now; this codebase cannot do that for you (see `SPRINT_6_HARD_GATE_TEST_PLAN.md`'s "What this codebase does and does not control").

## 6. Run the Hard Gate test

- [ ] Follow `SPRINT_6_HARD_GATE_TEST_PLAN.md` exactly (3 steps, screenshots/recording as evidence).
- [ ] Attach the evidence to `SPRINT_6_INTEGRATION_CHECKLIST.md` item 4.
- [ ] Update that item's status from DEFERRED to PASS or FAIL.

## 7. Smoke-test the partner message fix

- [ ] With the real News post from step 3 published, load the Home page and confirm "Message from Fali" shows her real post.
- [ ] Temporarily unpublish/demote that post (or test against a moment before she's posted) and confirm the card shows the calm empty state ("No message from Fali this week"), never someone else's post.

## 8. Close the loop

- [ ] `SPRINT_6_INTEGRATION_CHECKLIST.md`: items 3 and 4 updated from DEFERRED to a real status with evidence.
- [ ] Come back with results — if either fails, that's a real finding to fix (destination permissions, a group name mismatch, a missing List), not a code regression in this repo.

---

Once every box above is checked, Sprint 6 (including its closeout) is fully signed off, and Sprint 7 planning (see `ARCHITECTURE_DEBT.md`) can start from a clean baseline.
