# Design Token Debt

This is the single register of every place the SPFx experience layer (`src/`) could not faithfully reproduce the approved wireframe (`HOS_All_Departments_Wireframe_v1.html`) using an existing Sprint 1 design token, and instead used the nearest existing token plus an explicit, documented workaround. It exists so these compromises are visible in one place instead of scattered across component comments, and so whoever owns the token system (Sprint 1 stewards) has a ready-made backlog instead of having to grep the whole codebase for "FLAGGED".

**Process, going forward (mandatory as of Sprint 5):** when a component hits a gap between what the wireframe wants and what the token system offers, the full explanation of the gap and the workaround belongs in this file, not in a long inline comment. The component's own code should carry only a short comment naming which entry below applies (e.g. `// See DESIGN_TOKEN_DEBT.md #2 — accentTint wash`), so the reasoning lives in exactly one place and does not drift out of sync across the (growing) number of components that hit the same gap.

Nothing in this file blocks a sprint from shipping. Every entry below is a shipped, working, visually-close approximation — this is a backlog for the token system's owners, not an open defect list against any component.

---

## 1. No token for "translucent light wash over a dark/colored surface" — RESOLVED in Sprint A5 (documented residuals below)

**Origin:** Sprint 2, `src/layouts/NavigationItem/NavigationItem.module.scss` (`.active` state).

**Also affects:**

- Sprint 2, `src/layouts/Header/Header.module.scss` (`.userMenu:hover` — same technique, `hoverOverlay` step)
- Sprint 3, `src/webparts/hamu360Shell/components/HeroSection/_heroCard.scss` (`@mixin hero-card`'s `::before`, shared by `PartnerMessageCard`, `AnnouncementsFeed`, `QuickLinksGrid`)
- Sprint A2, `_heroCard.scss`'s `hero-card` mixin — extended to also cover the wireframe's `.hc { border: 0.5px solid rgba(255,255,255,.1) }`, previously omitted entirely (not an approximation gap, an outright miss); now shares the same `::before`/`active-overlay` pairing as the background wash.
- Sprint A2, `QuickLinksGrid.module.scss`'s `.tile::before` — same border addition as above, for the wireframe's `.ql` border.
- Sprint A2, `AnnouncementsFeed.module.scss`'s `.item:not(:last-child)::after` — the wireframe's `.anr` row divider (`border-bottom: 0.5px solid rgba(255,255,255,.07)`), previously absent; same `active-overlay` step, applied as a 1px bottom line instead of a border shorthand since the divider only needs one edge.
- Sprint A2, `Header.module.scss`'s new `.search` (decorative search box, wireframe `.srch`) — background and border share the pseudo-element technique; a third alpha value (text color, wireframe 0.5) approximated separately with `disabled` (0.4), the nearer of the two existing text-opacity steps.
- Sprint A3, `PartnerMessageCard.module.scss`'s `.avatar::after` — the wireframe's `2px solid rgba(255,255,255,.2)` ring around the Partner Message avatar, previously omitted entirely (Sprint 3 called it "a small, flagged, accepted visual simplification"; Sprint A3 closes it). A variant of the established technique: a separate ring pseudo-element rather than the avatar's own `::before`/`currentColor`, since `.avatar`'s `color` is already committed to navy (for the initials' contrast against the gold fill) — the ring needs its own explicit white color independent of that. Same `active-overlay` (0.08) step approximating the wireframe's 0.2.

**The gap:** the wireframe repeatedly sits a translucent tint of one color over a differently-colored surface. `ISemanticColorTokens` only defines `hover`/`active` as fixed navy-tinted rgba values tuned for _light_ surfaces (see `colors.ts`) — there is no semantic token for "take this element's own color and lay a translucent version of it over whatever it's sitting on."

**Sprint 7 finding — this is two distinct gaps wearing one description, not one:** re-reading the wireframe's actual CSS (not just the rendered approximation) during this sprint's audit found the exact source values, and they don't share a single fix:

- `NavigationItem.active`'s wash is `.ni.on { background: rgba(221, 170, 57, 0.18); }` — a **gold** wash (`gold500` at 18% alpha) sitting on the **navy** nav bar. This is coincidentally the _exact_ rgba value Sprint 7 already had to invent for `darkColors.accentBackground` (see entry 2's resolution below) — but `lightColors.accentBackground` is a flat, _solid_ pale gold (`gold300`), correct for icon chips on white cards, and visibly wrong if reused here (too opaque against navy chrome, and this element's surface is always navy regardless of light/dark theme). So entry 2's new tokens do **not** close this instance, despite the tempting value coincidence.
- `_heroCard.scss`'s wash is `rgba(255, 255, 255, 0.07)` — **white**, not gold, at a much lower alpha, sitting on the same navy surface. A third, unrelated value.
- `Header.module.scss`'s `.userMenu:hover` wash has no single wireframe source value to anchor to at all (Sprint 2's own note called it "an unspecified hover tint") — it was an invented affordance, not a reproduction.

**Historical workaround:** `currentColor` + a `token-opacity()` step (`active-overlay` 0.08 or `hover-overlay` 0.04) via a `::before` pseudo-element — the nearest available step, never the wireframe's actual alpha in the strongest instances.

**The fix (Sprint A5)** — exactly the shape this entry predicted, delivered under Sprint A5's explicit "extend the design system, never one-off values" mandate (the sign-off this entry was waiting for). `opacity.ts` gained one overlay step and three text-ladder steps, all anchored to the wireframe's actual alphas:

- `strongOverlay: 0.18` — exact for `.ni.on`'s gold active-nav wash (migrated: `NavigationItem.active::before`, previously 0.08 — the active pill finally renders at full wireframe strength). Also carries the Partner Message avatar ring (wireframe 0.2, migrated from 0.08) and the search box border (wireframe 0.15, split onto its own `::after` so it no longer shares the fill's 0.08) — both within ±0.03 of the step. Also now the hover/focus deepen step for `QuickLinksGrid.tile` (fixing a Sprint 7 bug where the deepen went to `full` 1.0 — a solid white wash behind white text that made hovered tiles unreadable).
- `soft: 0.78` / `subtle: 0.5` / `faint: 0.33` — the wireframe's white-on-navy _text_ ladder, previously collapsed onto `muted` (0.65) and `disabled` (0.4). Migrated: partner message body + announcement rows (0.78 exact), quick-link labels (0.75→soft), search placeholder (0.5 exact), announcement/message timestamps (0.33/0.32) and footer text (0.32).

**Documented residuals (deliberate, all ≤0.03 from truth or tied between steps):** `_heroCard.scss`'s 0.07 wash and the `.anr` divider stay on `activeOverlay` (0.08); the `.hc`/`.ql` borders (0.1) stay on `activeOverlay`; the `.srch` fill (0.09) stays on `activeOverlay`; the hero's gold blob (0.06) stays on `hoverOverlay` (0.04 — an exact tie with `activeOverlay`, kept per the round-down-on-a-tie precedent); `.ni`'s inactive text (0.6) stays on `muted` (0.65). `Header.userMenu:hover` still has no wireframe value to chase and stays as-is indefinitely.

---

## 2. No pale-gold / dark-gold background-foreground pair (`accentBackground`/`accentForeground`) — RESOLVED in Sprint 7

**Origin:** Sprint 4, `src/webparts/hamu360Shell/components/HubCardGrid/HubCard/HubCard.module.scss` (`.iconAccentTint`, the People & Culture hub tile).

**Also affected (as of Sprint 5, before this fix):**

- `EventsWidget` — the date-box (wireframe `.ev-box`/`.ev-d`/`.ev-m`, pale-gold background + dark-gold numerals)
- `NewJoinersWidget` — the default avatar treatment (wireframe `.jav`, pale-gold background + dark-gold initials)
- `FirmWinsWidget` — the category icon chip and category tag (wireframe `.wric`/`.wrtag`, same pale/dark-gold pairing)

**The gap (historical):** the wireframe's own `--gl` (pale gold) / `--gd` (dark gold) custom properties had no equivalent in `ISemanticColorTokens`. `accent` (`colors.ts`'s `gold500`) was the only gold-family token — the _solid_, full-strength brand gold, not a pastel tint suitable as a background, the same way `successBackground`/`warningBackground`/`dangerBackground`/`infoBackground` exist as pastel companions to their solid counterparts.

**The fix:** `accentBackground`/`accentForeground` added to `ISemanticColorTokens` (`src/theme/colors.ts`) in Sprint 7. `lightColors` uses `palette.gold300`/`palette.gold700` directly — both already existed in the private palette (defined in Sprint 1, never exposed) and are an exact match for the wireframe's `--gl`/`--gd`. `darkColors` uses a translucent wash of `gold500` (`rgba(221, 170, 57, 0.18)`) as the background (a flat `gold300` background reads wrong against a navy dark-mode card the way it doesn't against a white light-mode one) and `gold300` itself as the foreground, for the same "translucent wash instead of a flat pastel" reasoning entry 1 above is about — dark mode's version of this token is itself a small, deliberate instance of entry 1's pattern, not a contradiction of it.

All four call sites (`HubCard.iconAccentTint`, `EventsWidget.dateBox`, `NewJoinersWidget.avatar`, `FirmWinsWidget.iconBox`/`.tag`) now use flat `background-color: $color-accent-background; color: $color-accent-foreground;` — the `currentColor` + opacity pseudo-element workaround, and the extra DOM node it required in three of the four files, has been removed entirely.

---

## 3. No typography role below `label` (10px) — a `micro` role — RESOLVED in Sprint A4

**Origin:** Sprint 2, `src/layouts/Header/Logo.module.scss` (`.title`/`.tagline` — wireframe's 12px wordmark and 8px tagline, both collapsed onto `label`'s single 10px step) and `src/layouts/Footer/Footer.module.scss` (`.dim` — wireframe's 7.5px `.ft` line).

**Also affects:**

- `EventsWidget` — `.ev-sub` (8.5px), `.ev-m` (6.5px, the month abbreviation in the date box)
- `NewJoinersWidget` — `.jrole` (8.5px), `.jbadge` (7px)
- `RegulatoryUpdatesWidget` — `.rrtxt` (9.5px), `.rrdate` (8px)
- `FirmWinsWidget` — `.wrtxt` (9.5px), `.wrtag` (7px)

**The gap:** `label` (10px/600) is the smallest step the Sprint 1 type scale defines. The wireframe's dashboard widgets lean heavily on sizes below that floor — every single one of the four Sprint 5 widgets has at least one piece of copy in the 6.5–9.5px range, which is smaller than anything the type scale currently names. The instances cluster around two steps: roughly 8.5–9.5px (`ev-sub`, `jrole`, `rrtxt`, `wrtxt`) and roughly 6.5–8px (`tagline`, `.dim`, `ev-m`, `jbadge`, `rrdate`, `wrtag`) — matching this file's own long-standing prediction that a real fix would need two new roles, not one.

**Historical workaround:** every below-floor text used `@include typography(label)` (10px/600), differentiated from adjacent text by color/opacity instead of by size.

**Sprint 7 status (historical):** evaluated and deliberately deferred — introducing new roles would have changed size and weight at up to ten call sites simultaneously with no way to visually verify in that sprint's environment.

**The fix (Sprint A4):** the type scale gained the two predicted roles, anchored to the wireframe's actual clusters rather than to round numbers:

- `micro` — **9.5px / 400 / 1.5** — the wireframe's small-body-copy cluster (`.mp-msg`, `.anr-t`, `.ql`, `.rrtxt`, `.wrtxt` are all exactly 9.5px/400; `.hgreet` 9px and `.srch` 10px sit within 0.5px). Migrated: `PartnerMessageCard.message`, `AnnouncementsFeed.title`, `QuickLinksGrid.tile`, `RegulatoryUpdatesWidget.updateTitle`, `FirmWinsWidget.winTitle`, `HeroSection.eyebrow`, `Header.searchText`. Because `micro` carries the wireframe's regular 400 weight, Sprint 5's "wrong weight, no ad hoc override" compromise on `rrtxt`/`wrtxt` dissolved on its own — no sub-property override was ever added.
- `microLabel` — **8.5px / 400 / 1.4** — the metadata cluster (`.ev-sub`, `.jrole`, `.hub-sub`, `.hcl` at exactly 8.5px; `.mp-role`, `.mp-date`, `.anr-dt`, `.rrdate`, `.ls` at 8px; `.ft` at 7.5px — all within 1px). Migrated: all of the above call sites plus `Logo.tagline`, `Footer.line`, `NewJoinersWidget.roleLine`/`.comingSoon`, `EventsWidget.eventLocation`/`.month`, `HubCard.subtitle`.
- `badge` — **7px / 700 / 1.3** — the wireframe's tiny bold chip text (`.jbadge`, `.wrtag`, both exactly 7px/700). Migrated: `NewJoinersWidget.badge`, `FirmWinsWidget.tag`.

**Accepted residuals (documented, not silent):** `.ev-m` (6.5px) rides `microLabel` at +2px — a role below 8.5px would be unreadable as anything but decoration and the wireframe uses 6.5px exactly once; `.ft` (7.5px) rides `microLabel` at +1px; `.hgreet` (9px) and `.srch` (10px) ride `micro` at ±0.5px. All within the same ±-nearest-step tolerance the spacing scale has always used. Avatar/monogram initials (`.jav` 8.5px/700, `.nav-av` 9px/700) were deliberately _not_ migrated — they are a weight-700 family that belongs with entry 6, not with these regular-weight roles.

---

## 4. `Grid` component's `GridColumns` enum has no 5-column option — RESOLVED in Sprint 7

**Origin:** Sprint 4, `src/webparts/hamu360Shell/components/HubCardGrid/HubCardGrid.module.scss`.

**The gap (historical):** `@components/Grid`'s `GridColumns` type (`src/components/Grid/IGridProps.ts`) only supported `1 | 2 | 3 | 4 | 6 | 12`. The wireframe's Team Hub Cards row (`.hubs { grid-template-columns: repeat(5, 1fr); }`) needs exactly 5, so `HubCardGrid` hand-rolled its own local grid instead of using the shared primitive.

**The fix:** `GridColumns` now includes `5`; `Grid.module.scss` gained a `.columns5` step (2 → 3 → 5, copied verbatim from the old hand-rolled ramp — same visual behavior, not a new one). `HubCardGrid.tsx` now renders `<Grid as="ul" columns={5} gap="sm">` instead of a raw `<ul className={styles.grid}>`; `HubCardGrid.module.scss` (which held nothing but that one now-redundant class) has been deleted entirely.

---

## 5. No typography role at 12px/600 (between `label` and `caption`) — RESOLVED in Sprint A4

**Origin:** Sprint 5, `EventsWidget.module.scss` (`.day` — the date-box's day-of-month numeral, wireframe `.ev-d`: 12px/600).

**The gap:** this is a different shape of gap from entry 3 — not a value below the type floor, but a value that sits _between_ two existing roles without matching either. `label` (10px/600) matches the wireframe's weight but not its size; `caption` (11px/500) is one step closer on size but drops the bold weight. Neither is an exact reproduction.

**Historical workaround:** `caption` (11px/500) — chosen as the nearest role by raw size distance.

**The fix (Sprint A4):** `labelStrong` (**12px / 600 / 1.3**) added to the type scale — an exact match for the wireframe's `.ev-d` (event date-box day numeral) _and_ `.lt` (logo wordmark), which turned out to be the same 12px/600 text role wearing two hats. Both call sites migrated (`EventsWidget.day`, `Logo.title`); `.day` keeps its wireframe-specified `line-height: 1` as a per-site override, exactly as the wireframe itself sets it. Delivered in the same coordinated pass as entry 3, as this entry always recommended.

---

## 6. No typography role for avatar/monogram initials (bold, 8.5–13px) — OPEN, new in Sprint A4

**Origin:** Sprint A4's full-page typography audit, which migrated every other below-floor text to the new `micro`/`microLabel`/`badge` roles (entry 3) and found one family that fits none of them.

**Affects:**

- `src/layouts/Header/Logo.module.scss` — `.mark` (wireframe `.lm`: 13px/700, the gold logo tile's "H") — now on `labelStrong` (12px/600, the nearest role; previously `title`, 15px/600, which was further off on size)
- `src/layouts/Header/Header.module.scss` — `.avatar` (wireframe `.nav-av`: 9px/700) — on `label` (10px/600)
- `src/webparts/hamu360Shell/components/DashboardWidgetGrid/NewJoinersWidget/NewJoinersWidget.module.scss` — `.avatar` (wireframe `.jav`: 8.5px/700) — on `label` (10px/600)

**The gap:** the wireframe consistently renders initials inside circular/rounded chips at **weight 700**, at whatever size the chip's diameter dictates (13px in a 27px tile, 9px in a 25px circle, 8.5px in a 26px circle). No role in the scale — including Sprint A4's additions — carries 700 at these sizes (`badge` is 700 but 7px, too small for all three). These are decorative monograms whose size tracks their _container_, not the type hierarchy, which is why Sprint A4 deliberately did not force them onto the new roles.

**Current workaround:** nearest existing role by size (`labelStrong` or `label`), accepting a one-step weight softening (600 vs 700) — near the rendering threshold at these sizes inside filled chips.

**What a real fix looks like:** a design decision first — either a fixed `monogram` role (~9px/700, accepting residuals at 13px and 8.5px), or chip components that size initials relative to their own diameter (an em-based token, a different shape from everything else in `typography.ts`). Parked here rather than guessed at.

---

## Summary table

| #   | Gap                                             | First seen | Status (Sprint A5)                                                                                                                                   | Instances |
| --- | ----------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | Translucent wash over a colored surface         | Sprint 2   | **RESOLVED (Sprint A5)** — `strongOverlay` (0.18) + `soft`/`subtle`/`faint` text ladder added; strongest instances exact, ≤0.03 residuals documented | 8         |
| 2   | Pale/dark gold background-foreground pair       | Sprint 4   | **RESOLVED (Sprint 7)** — `accentBackground`/`accentForeground` added, all 4 call sites migrated                                                     | 4         |
| 3   | Typography role below `label` (10px)            | Sprint 2   | **RESOLVED (Sprint A4)** — `micro` (9.5/400), `microLabel` (8.5/400), `badge` (7/700) added; all call sites migrated                                 | 10        |
| 4   | `Grid` missing a 5-column option                | Sprint 4   | **RESOLVED (Sprint 7)** — `GridColumns` widened, `HubCardGrid` migrated to the shared primitive                                                      | 1         |
| 5   | No role at 12px/600 (between `label`/`caption`) | Sprint 5   | **RESOLVED (Sprint A4)** — `labelStrong` (12/600) added; `EventsWidget.day` + `Logo.title` migrated                                                  | 2         |
| 6   | No bold monogram/initials role (8.5–13px/700)   | Sprint A4  | OPEN — needs a design decision (fixed role vs container-relative sizing)                                                                             | 3         |

This table should be updated every time a sprint adds a new instance of an existing entry, resolves one, or adds a genuinely new entry — not left to go stale.
