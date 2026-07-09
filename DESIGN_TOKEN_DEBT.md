# Design Token Debt

This is the single register of every place the SPFx experience layer (`src/`) could not faithfully reproduce the approved wireframe (`HOS_All_Departments_Wireframe_v1.html`) using an existing Sprint 1 design token, and instead used the nearest existing token plus an explicit, documented workaround. It exists so these compromises are visible in one place instead of scattered across component comments, and so whoever owns the token system (Sprint 1 stewards) has a ready-made backlog instead of having to grep the whole codebase for "FLAGGED".

**Process, going forward (mandatory as of Sprint 5):** when a component hits a gap between what the wireframe wants and what the token system offers, the full explanation of the gap and the workaround belongs in this file, not in a long inline comment. The component's own code should carry only a short comment naming which entry below applies (e.g. `// See DESIGN_TOKEN_DEBT.md #2 — accentTint wash`), so the reasoning lives in exactly one place and does not drift out of sync across the (growing) number of components that hit the same gap.

Nothing in this file blocks a sprint from shipping. Every entry below is a shipped, working, visually-close approximation — this is a backlog for the token system's owners, not an open defect list against any component.

---

## 1. No token for "translucent light wash over a dark/colored surface" — OPEN, sharpened in Sprint 7

**Origin:** Sprint 2, `src/layouts/NavigationItem/NavigationItem.module.scss` (`.active` state).

**Also affects:**

- Sprint 2, `src/layouts/Header/Header.module.scss` (`.userMenu:hover` — same technique, `hoverOverlay` step)
- Sprint 3, `src/webparts/hamu360Shell/components/HeroSection/_heroCard.scss` (`@mixin hero-card`'s `::before`, shared by `PartnerMessageCard`, `AnnouncementsFeed`, `QuickLinksGrid`)

**The gap:** the wireframe repeatedly sits a translucent tint of one color over a differently-colored surface. `ISemanticColorTokens` only defines `hover`/`active` as fixed navy-tinted rgba values tuned for _light_ surfaces (see `colors.ts`) — there is no semantic token for "take this element's own color and lay a translucent version of it over whatever it's sitting on."

**Sprint 7 finding — this is two distinct gaps wearing one description, not one:** re-reading the wireframe's actual CSS (not just the rendered approximation) during this sprint's audit found the exact source values, and they don't share a single fix:

- `NavigationItem.active`'s wash is `.ni.on { background: rgba(221, 170, 57, 0.18); }` — a **gold** wash (`gold500` at 18% alpha) sitting on the **navy** nav bar. This is coincidentally the _exact_ rgba value Sprint 7 already had to invent for `darkColors.accentBackground` (see entry 2's resolution below) — but `lightColors.accentBackground` is a flat, _solid_ pale gold (`gold300`), correct for icon chips on white cards, and visibly wrong if reused here (too opaque against navy chrome, and this element's surface is always navy regardless of light/dark theme). So entry 2's new tokens do **not** close this instance, despite the tempting value coincidence.
- `_heroCard.scss`'s wash is `rgba(255, 255, 255, 0.07)` — **white**, not gold, at a much lower alpha, sitting on the same navy surface. A third, unrelated value.
- `Header.module.scss`'s `.userMenu:hover` wash has no single wireframe source value to anchor to at all (Sprint 2's own note called it "an unspecified hover tint") — it was an invented affordance, not a reproduction.

**Current workaround (unchanged):** `currentColor` + a `token-opacity()` step (`active-overlay` 0.08 or `hover-overlay` 0.04) via a `::before` pseudo-element — the nearest available step, never the wireframe's actual alpha (0.18 or 0.07) in any of the three instances.

**Why this stays open rather than being resolved this sprint:** unlike entry 2 (one clean reusable pair, four identical call sites), the three instances here want three different values with no shared reuse pattern — closing this "properly" means either three bespoke tokens (arguably not "systematic" at all) or a broader design conversation about whether `opacity.ts` should grow a precise `0.18` step for currentColor-on-navy washes specifically. That is a real design-system decision (how many overlay steps is too many?), not a mechanical token-and-migrate change like entry 2 was — deliberately not made unilaterally in a presentation-only polish sprint. Flagged for explicit sign-off before Sprint 8, now with the exact target values attached so whoever makes that call isn't starting from scratch.

**What a real fix looks like:** most likely a new `opacity.ts` step (e.g. `strongOverlay: 0.18`) for the `NavigationItem`/`.qli` gold-on-navy family, used exactly like the existing `currentColor` + pseudo-element pattern already does — just with a more accurate alpha — plus a judgment call on whether `_heroCard.scss`'s 0.07 white wash gets its own step or stays approximated at `hoverOverlay` (0.04, the closer of the two existing steps to 0.07). `Header.module.scss`'s `.userMenu:hover` has no wireframe value to chase at all, so it can stay exactly as-is indefinitely — there's nothing to converge toward.

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

## 3. No typography role below `label` (10px) — a `micro` role — OPEN, deliberately not migrated in Sprint 7

**Origin:** Sprint 2, `src/layouts/Header/Logo.module.scss` (`.title`/`.tagline` — wireframe's 12px wordmark and 8px tagline, both collapsed onto `label`'s single 10px step) and `src/layouts/Footer/Footer.module.scss` (`.dim` — wireframe's 7.5px `.ft` line).

**Also affects:**

- `EventsWidget` — `.ev-sub` (8.5px), `.ev-m` (6.5px, the month abbreviation in the date box)
- `NewJoinersWidget` — `.jrole` (8.5px), `.jbadge` (7px)
- `RegulatoryUpdatesWidget` — `.rrtxt` (9.5px), `.rrdate` (8px)
- `FirmWinsWidget` — `.wrtxt` (9.5px), `.wrtag` (7px)

**The gap:** `label` (10px/600) is the smallest step the Sprint 1 type scale defines. The wireframe's dashboard widgets lean heavily on sizes below that floor — every single one of the four Sprint 5 widgets has at least one piece of copy in the 6.5–9.5px range, which is smaller than anything the type scale currently names. The instances cluster around two steps: roughly 8.5–9.5px (`ev-sub`, `jrole`, `rrtxt`, `wrtxt`) and roughly 6.5–8px (`tagline`, `.dim`, `ev-m`, `jbadge`, `rrdate`, `wrtag`) — matching this file's own long-standing prediction that a real fix would need two new roles, not one.

**Current workaround (unchanged):** every below-floor text uses `@include typography(label)` (10px/600), differentiated from adjacent text by color/opacity instead of by size.

**Sprint 7 status — evaluated and deliberately deferred, not silently skipped:** this sprint's brief explicitly asked to resolve whatever token debt is resolvable. This entry technically qualifies (adding two new `TypographyRole` values is a pure, additive, non-architectural change) — but the entry's own weight notes reveal something the size notes alone don't: several sites already deliberately mismatch the wireframe's _weight_ too (e.g. `RegulatoryUpdatesWidget.rrtxt` keeps `label`'s 600 weight against the wireframe's regular 400, a Sprint 5 self-correction that chose "wrong weight, no ad hoc override" over "right weight, mixin sub-property override"). Introducing new roles at the _correct_ size and weight would silently change both dimensions at up to ten call sites simultaneously, and this sandbox has no way to render the result against the wireframe to confirm each change is actually an improvement rather than a new, differently-wrong mismatch (no browser, no screenshot tool available in this environment). Per the brief's own "do not assume" instruction, that is exactly the kind of change this sprint declines to make blind. **This is a scope decision, not an oversight** — flagged here explicitly rather than left implicit.

**What a real fix looks like (unchanged, still the recommended path):** add two roles — `micro` (~9px) and `microSmall` (~7px), both closer to the wireframe's actual weights per-instance than `label`'s blanket 600 — then migrate each of the ten call sites above one at a time with a visual check against the wireframe (a real browser/screenshot tool, not this sandbox) before committing each swap. Recommended as a Sprint 8 candidate specifically because it needs that visual verification loop this environment can't provide.

---

## 4. `Grid` component's `GridColumns` enum has no 5-column option — RESOLVED in Sprint 7

**Origin:** Sprint 4, `src/webparts/hamu360Shell/components/HubCardGrid/HubCardGrid.module.scss`.

**The gap (historical):** `@components/Grid`'s `GridColumns` type (`src/components/Grid/IGridProps.ts`) only supported `1 | 2 | 3 | 4 | 6 | 12`. The wireframe's Team Hub Cards row (`.hubs { grid-template-columns: repeat(5, 1fr); }`) needs exactly 5, so `HubCardGrid` hand-rolled its own local grid instead of using the shared primitive.

**The fix:** `GridColumns` now includes `5`; `Grid.module.scss` gained a `.columns5` step (2 → 3 → 5, copied verbatim from the old hand-rolled ramp — same visual behavior, not a new one). `HubCardGrid.tsx` now renders `<Grid as="ul" columns={5} gap="sm">` instead of a raw `<ul className={styles.grid}>`; `HubCardGrid.module.scss` (which held nothing but that one now-redundant class) has been deleted entirely.

---

## 5. No typography role at 12px/600 (between `label` and `caption`) — OPEN, same reasoning as entry 3

**Origin:** Sprint 5, `EventsWidget.module.scss` (`.day` — the date-box's day-of-month numeral, wireframe `.ev-d`: 12px/600).

**The gap:** this is a different shape of gap from entry 3 — not a value below the type floor, but a value that sits _between_ two existing roles without matching either. `label` (10px/600) matches the wireframe's weight but not its size; `caption` (11px/500) is one step closer on size but drops the bold weight. Neither is an exact reproduction.

**Current workaround:** `caption` (11px/500) — chosen as the nearest role by raw size distance.

**Sprint 7 status:** left open for the same reason as entry 3 — a single call site is easy to migrate correctly, but doing it as a one-off next to entry 3's ten deferred sites would fragment the eventual fix into two separate migrations instead of one coordinated pass. Bundle with entry 3's Sprint 8 work rather than fixing in isolation.

**What a real fix looks like (unchanged):** a new role at 12px/600, added and verified in the same Sprint 8 pass as entry 3.

---

## Summary table

| #   | Gap                                             | First seen | Status (Sprint 7)                                                                          | Instances |
| --- | ----------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ | --------- |
| 1   | Translucent wash over a colored surface         | Sprint 2   | OPEN — sharpened with exact wireframe values, needs a design decision on new opacity steps | 3         |
| 2   | Pale/dark gold background-foreground pair       | Sprint 4   | **RESOLVED** — `accentBackground`/`accentForeground` added, all 4 call sites migrated      | 4         |
| 3   | Typography role below `label` (10px)            | Sprint 2   | OPEN — deliberately deferred, needs visual verification this sandbox can't provide         | 10        |
| 4   | `Grid` missing a 5-column option                | Sprint 4   | **RESOLVED** — `GridColumns` widened, `HubCardGrid` migrated to the shared primitive       | 1         |
| 5   | No role at 12px/600 (between `label`/`caption`) | Sprint 5   | OPEN — bundle with entry 3                                                                 | 1         |

This table should be updated every time a sprint adds a new instance of an existing entry, resolves one, or adds a genuinely new entry — not left to go stale.
