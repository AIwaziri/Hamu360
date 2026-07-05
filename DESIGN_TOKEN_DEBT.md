# Design Token Debt

This is the single register of every place the SPFx experience layer (`src/`) could not faithfully reproduce the approved wireframe (`HOS_All_Departments_Wireframe_v1.html`) using an existing Sprint 1 design token, and instead used the nearest existing token plus an explicit, documented workaround. It exists so these compromises are visible in one place instead of scattered across component comments, and so whoever owns the token system (Sprint 1 stewards) has a ready-made backlog instead of having to grep the whole codebase for "FLAGGED".

**Process, going forward (mandatory as of Sprint 5):** when a component hits a gap between what the wireframe wants and what the token system offers, the full explanation of the gap and the workaround belongs in this file, not in a long inline comment. The component's own code should carry only a short comment naming which entry below applies (e.g. `// See DESIGN_TOKEN_DEBT.md #2 — accentTint wash`), so the reasoning lives in exactly one place and does not drift out of sync across the (growing) number of components that hit the same gap.

Nothing in this file blocks a sprint from shipping. Every entry below is a shipped, working, visually-close approximation — this is a backlog for the token system's owners, not an open defect list against any component.

---

## 1. No token for "translucent light wash over a dark/colored surface"

**Origin:** Sprint 2, `src/layouts/NavigationItem/NavigationItem.module.scss` (`.active` state).

**Also affects:**
- Sprint 2, `src/layouts/Header/Header.module.scss` (`.userMenu:hover` — same technique, `hoverOverlay` step)
- Sprint 3, `src/webparts/hamu360Shell/components/HeroSection/_heroCard.scss` (`@mixin hero-card`'s `::before`, shared by `PartnerMessageCard`, `AnnouncementsFeed`, `QuickLinksGrid`)

**The gap:** the wireframe repeatedly sits a translucent tint of one color (usually white, or the element's own foreground color) over a differently-colored surface — e.g. `NavigationItem.active`'s gold wash on navy, `.hc`'s `rgba(255,255,255,.07)` white wash on the navy hero band. `ISemanticColorTokens` only defines `hover`/`active` as fixed navy-tinted rgba values tuned for *light* surfaces (see `colors.ts`) — there is no semantic token for "take this element's own color and lay a translucent version of it over whatever it's sitting on."

**Current workaround:** a `position: relative` element with a `::before` pseudo-element, `background-color: currentColor`, `opacity: token-opacity(active-overlay)` (0.08) or `token-opacity(hover-overlay)` (0.04) — whichever existing opacity step is nearest to the wireframe's own value (0.18, 0.07, or an unspecified hover tint respectively). `currentColor` is what makes this reusable per-element without a new color token; the opacity step is always an approximation, never an exact match to the wireframe's hand-tuned value.

**What a real fix looks like:** a dedicated "surface wash" token pair in `ISemanticColorTokens`, e.g. `accentBackground` (see entry 2 below — the two gaps overlap) plus a small set of named overlay-on-color opacity steps that don't assume a light surface. Four independent instances of the same pseudo-element trick (three prior to Sprint 5, none new this sprint) is strong evidence this belongs in the token system itself rather than being re-solved per component.

---

## 2. No pale-gold / dark-gold background-foreground pair (`accentBackground`/`accentForeground`)

**Origin:** Sprint 4, `src/webparts/hamu360Shell/components/HubCardGrid/HubCard/HubCard.module.scss` (`.iconAccentTint`, the People & Culture hub tile).

**Also affects (new in Sprint 5):**
- `EventsWidget` — the date-box (wireframe `.ev-box`/`.ev-d`/`.ev-m`, pale-gold background + dark-gold numerals)
- `NewJoinersWidget` — the default avatar treatment (wireframe `.jav`, pale-gold background + dark-gold initials)
- `FirmWinsWidget` — the category icon chip and category tag (wireframe `.wric`/`.wrtag`, same pale/dark-gold pairing)

**The gap:** the wireframe's own `--gl` (pale gold) / `--gd` (dark gold) custom properties have no equivalent in `ISemanticColorTokens`. `accent` (`colors.ts`'s `gold500`) is the only gold-family token, and it's the *solid*, full-strength brand gold used for CTAs and active states — not a pastel tint suitable as a background behind other content, the same way `successBackground`/`warningBackground`/`dangerBackground`/`infoBackground` exist as pastel companions to their solid counterparts.

**Current workaround:** the same `currentColor` + `token-opacity(active-overlay)` pseudo-element technique as entry 1, with `accent` as the base color. This produces a translucent gold wash that reads reasonably close to the wireframe's pale gold at a glance, but it is a genuine compromise: it is not the wireframe's actual `--gl` swatch, and the "dark gold" foreground text/icon color in these workarounds is `accent` itself rather than a purpose-built darker step (`--gd` is visibly darker than `gold500` in the wireframe's own palette).

**Why this is the strongest entry in this file:** as of Sprint 5, this exact gap has now been hit independently four times across three sprints (Sprint 4's hub tile, and three more Sprint 5 widgets) with the *same* two-swatch pattern each time. This is no longer an edge case — it is a missing pair that belongs alongside the existing status-color background pairs.

**What a real fix looks like:** add `accentBackground: string` (→ the wireframe's `--gl`, a pale gold) and `accentForeground: string` (→ the wireframe's `--gd`, a dark gold usable as text/icon color on that background) to `ISemanticColorTokens`, in both `lightColors` and `darkColors`. Every one of the four call sites above becomes a two-line change (swap the pseudo-element trick for flat `background-color: $color-accent-background; color: $color-accent-foreground;`) once this lands — none of them need re-architecting, only re-pointing.

---

## 3. No typography role below `label` (10px) — a `micro` role

**Origin:** Sprint 2, `src/layouts/Header/Logo.module.scss` (`.title`/`.tagline` — wireframe's 12px wordmark and 8px tagline, both collapsed onto `label`'s single 10px step) and `src/layouts/Footer/Footer.module.scss` (`.dim` — wireframe's 7.5px `.ft` line).

**Also affects (new in Sprint 5 — by far the largest single group of instances):**
- `EventsWidget` — `.ev-sub` (8.5px), `.ev-m` (6.5px, the month abbreviation in the date box)
- `NewJoinersWidget` — `.jrole` (8.5px), `.jbadge` (7px)
- `RegulatoryUpdatesWidget` — `.rrtxt` (9.5px), `.rrdate` (8px)
- `FirmWinsWidget` — `.wrtxt` (9.5px), `.wrtag` (7px)

**The gap:** `label` (10px/600) is the smallest step the Sprint 1 type scale defines. The wireframe's dashboard widgets lean heavily on sizes below that floor — every single one of the four Sprint 5 widgets has at least one piece of copy in the 6.5–9.5px range, which is smaller than anything the type scale currently names.

**Current workaround:** every below-floor text in these widgets uses `@include typography(label)` (10px/600) and is differentiated from adjacent text by color/opacity/weight-via-token-opacity instead of by size, the same compromise Sprint 2 established for the Logo and Footer. This is a visibly looser match than every other typography role in the app (all of which land on the wireframe's exact px value) — it is the single largest remaining gap between the built widgets and pixel-perfect wireframe reproduction.

**What a real fix looks like:** add a `micro` role below `label` — the wireframe's own values cluster around two steps (~8.5px and ~6.5–7px), so this may need to be two new roles (`micro`/`microSmall`) rather than one, once someone audits every below-floor value across the whole approved wireframe (not just the screens built so far) to see the full spread. Given Sprint 5 alone adds eight new below-floor instances on top of Sprint 2's three, this is now the single highest-volume entry in this file and worth prioritizing over entries 1 and 2 if the Sprint 1 stewards can only pick up one at a time.

---

## 4. `Grid` component's `GridColumns` enum has no 5-column option

**Origin:** Sprint 4, `src/webparts/hamu360Shell/components/HubCardGrid/HubCardGrid.module.scss`.

**The gap:** `@components/Grid`'s `GridColumns` type (`src/components/Grid/IGridProps.ts`) only supports `1 | 2 | 3 | 4 | 6 | 12`. The wireframe's Team Hub Cards row (`.hubs { grid-template-columns: repeat(5, 1fr); }`) needs exactly 5.

**Current workaround:** `HubCardGrid` does not use the shared `Grid` component at all — it's a small, local, hand-rolled grid in `HubCardGrid.module.scss` using the exact same token-backed breakpoint mixins (`from-tablet`/`from-laptop`) that `Grid.module.scss` itself uses internally, just not routed through the shared React component. Forcing the nearest supported value (6) would leave a visibly empty sixth column on wide viewports; widening `Grid`'s own column ramp for every consumer app-wide was judged out of scope for one feature's layout need.

**Not affected by Sprint 5:** `DashboardWidgetGrid` needs exactly 4 columns, and `4` *is* one of `GridColumns`'s supported values — see `DashboardWidgetGrid.tsx`'s own docblock for why this sprint reuses the shared `Grid` component directly (with `columns={4}`) rather than repeating Sprint 4's local hand-rolled pattern. This entry is not resolved, but Sprint 5 did not have to add a second workaround for it.

**What a real fix looks like:** widen `GridColumns` to include `5`, and add the matching `.columns5` ramp to `Grid.module.scss` (1 col mobile → likely 2 or 3 tablet → 5 laptop+, mirroring the shape already used by `.columns4`/`.columns6`). If a future sprint hits a *second* need for an odd column count, that's a strong second signal this enum should just be widened to the full 1–6 range rather than special-cased column-by-column.

---

## 5. No typography role at 12px/600 (between `label` and `caption`)

**Origin:** Sprint 5, `EventsWidget.module.scss` (`.day` — the date-box's day-of-month numeral, wireframe `.ev-d`: 12px/600).

**The gap:** this is a different shape of gap from entry 3 — not a value below the type floor, but a value that sits *between* two existing roles without matching either. `label` (10px/600) matches the wireframe's weight but not its size; `caption` (11px/500) is one step closer on size but drops the bold weight. Neither is an exact reproduction.

**Current workaround:** `caption` (11px/500) — chosen as the nearest role by raw size distance. This is a visibly lighter weight than the wireframe's bold date numeral, the one deliberate visual softening in `EventsWidget`.

**What a real fix looks like:** either a new role at 12px/600, or (more likely, pending a fuller wireframe audit) recognizing that the type scale's steps are tuned for body/heading copy and don't yet cover the bolder, more compact numeral/stat style the wireframe uses in a few places (this date-box, and `.stat-num` elsewhere, which *is* already covered by `headingL`). A single additional isolated instance doesn't yet justify a new role on its own — flagged here so a second instance elsewhere is easy to notice and connect to this one.

---

## Summary table

| # | Gap | First seen | Instances (through Sprint 5) | Priority signal |
| --- | --- | --- | --- | --- |
| 1 | Translucent wash over a colored surface | Sprint 2 | 3 | Recurring |
| 2 | Pale/dark gold background-foreground pair | Sprint 4 | 4 | Recurring, strongest case |
| 3 | Typography role below `label` (10px) | Sprint 2 | 11 | Highest volume — recommend prioritizing |
| 4 | `Grid` missing a 5-column option | Sprint 4 | 1 | Isolated so far |
| 5 | No role at 12px/600 (between `label`/`caption`) | Sprint 5 | 1 | Isolated so far |

This table should be updated every time a sprint adds a new instance of an existing entry, or a genuinely new entry — not left to go stale.
