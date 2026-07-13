# Hamu360 Visual Regression Checklist

This is the permanent UI quality checklist for Hamu360, established in Sprint 7. **Every future sprint that touches presentation (components, `.module.scss`, layout, tokens) must be validated against this checklist before being considered complete.** It is a living document — add a row when a new component ships; update a row's expected behavior when a deliberate design change supersedes it.

**How to use this:** each item is a manual check against a running instance of the app (local workbench or a deployed site), performed by whoever is signing off the sprint. Where this document names a specific wireframe value, that value is extracted directly from `HOS_All_Departments_Wireframe_v1.html` — verify against the rendered app, not against another document's description of it. Unchecked items should block sign-off unless explicitly waived with a documented reason (the same discipline `DESIGN_TOKEN_DEBT.md`/`ARCHITECTURE_DEBT.md` already use).

**Known, already-documented exceptions** (do not re-flag these as new findings — they are accepted, tracked debt, not oversights):

- `DESIGN_TOKEN_DEBT.md` entries 1, 3, 5 (translucent-wash precision, sub-`label` typography sizes, the 12px/600 numeral role).
- `ARCHITECTURE.md` §28's `accentForeground`/`accentBackground` contrast finding (2.57:1, below AA — reproduces the wireframe's own `--gd`/`--gl` values exactly; pending an explicit decision, not silently missed).
- `ARCHITECTURE_DEBT.md` entry 1 (loading/error state is page-level, not per-widget, by design).

---

## Layout

- [ ] Container width matches wireframe — `Container maxWidth="desktop"` renders at 1180px max, matching `.shell { max-width: 1180px; }`, on every page section.
- [ ] Grid alignment verified — `HubCardGrid` (5 columns at laptop+) and `DashboardWidgetGrid` (4 columns at laptop+) both align to the same `Container` edges; no column drifts left/right of its neighbors.
- [ ] Section spacing verified — every top-level page section uses `Section spacing="lg"` for consistent vertical rhythm; only the `failedSections` notice banner deliberately uses `spacing="sm"` (a smaller, secondary element, not a content section).
- [ ] Header height verified — `Header` renders at a fixed height consistent with the wireframe's `.nav { height: 48px; }`, sticky, no layout shift on scroll.
- [ ] Footer alignment verified — `Footer` content aligns to the same `Container` width as page content above it; `MainLayout`'s flex-column keeps it pinned to the bottom on short pages.
- [ ] Section headings ("Team hubs — go to your workspace", "What's happening at Hamu Legal") render as a small, bold, uppercase, muted-color eyebrow label — NOT as unstyled body-sized text. (Regression check: this exact bug existed until Sprint 7 — `HomePage.module.scss`'s `.sectionHeading` had no typography rule at all. Watch for it recurring if this class is ever refactored.)

## Hero

- [ ] Typography hierarchy matches wireframe — eyebrow (date, all-caps, 40% opacity white) → title ("Good morning, Hamu Legal.", 20px/600) → three cards' own internal hierarchy (label → name/title → body → meta).
- [ ] Partner Message card verified — when a message exists: avatar initials, name, role, italic quoted message, date all render; when no message exists (`partnerMessage === undefined`): `EmptyState` ("No message from Fali this week") renders in its place, not a blank or broken card. Avatar shows a faint translucent ring around its edge (Sprint A3, new — previously absent).
- [ ] Announcements card verified — pinned items visually distinguished (per real `Pinned` List value, not position); empty state renders when `announcements.length === 0`; each row shows a faint bottom divider (Sprint A2) except the last.
- [ ] Quick Links verified — every tile is a real, keyboard-focusable `<button>`; hover AND keyboard-focus both visibly deepen the tile's background wash (Sprint 7 fix — previously no interactive feedback existed at all); empty state renders when `quickLinks.length === 0`.
- [ ] Hero band's two decorative background circles (soft white top-right, soft gold bottom-right) are visible and clipped to the band's edges, sitting behind all text/card content, never on top of it.
- [ ] All three hero cards (Partner Message, Announcements, Quick Links) and every Quick Links tile show a faint translucent border outline (Sprint A2 — previously all borderless).

## Navigation Bar

- [ ] Decorative search box ("Search HOS…") renders between the primary nav and the user menu at `tablet`+ width, hidden below `tablet` (Sprint A2, new). It is inert (`aria-hidden`, not a real control) — do not flag "search does nothing" as a bug; there is no search service in this codebase yet.
- [ ] User menu shows the avatar only, no visible name text beside it (Sprint A2 — name is now screen-reader-only via the button's own `aria-label`, matching the wireframe's `.nav-av`).
- [ ] Nav item padding, logo, and active-state wash match the wireframe within the same documented token-rounding tolerances as every other spacing/color approximation in this checklist (see `DESIGN_TOKEN_DEBT.md` #1).

## Hub Cards

- [ ] Equal heights — every visible `HubCard` in a row renders at the same height regardless of subtitle text length.
- [ ] Equal spacing — consistent `gap` between cards in every row and between rows, using `Grid`'s shared `columns5` step (migrated from a hand-rolled local grid in Sprint 7 — verify the visual ramp is unchanged: 2 columns mobile → 3 tablet → 5 laptop+).
- [ ] Hover behavior — mouse hover AND keyboard focus both show: border color shifts to accent gold, AND the card lifts (`translateY(-2px)`) with a subtle shadow (Sprint 7 addition). Confirm this does NOT happen on the four dashboard widget cards (deliberately non-interactive, no lift).
- [ ] Responsive stacking — resize through every breakpoint below and confirm the column count steps down cleanly with no partial/orphaned column, no horizontal scroll.
- [ ] Icon alignment — icon box is centered above the title on every tile; People & Culture tile's icon chip uses a flat pale-gold background with dark-gold icon color (Sprint 7: real tokens, no visible pseudo-element/wash artifact); icon-to-label margin below the icon box reads as a visible gap, not cramped (Sprint A3: `space(sm)`, previously `space(xs)`).
- [ ] MP Command Centre tile is completely absent from the DOM (not hidden via CSS) for a non-Managing-Partner account — inspect the rendered HTML, not just visual absence.

## Dashboard Widgets

For **each** of Events, New Joiners, Regulatory Updates, and Firm Wins, verify identically:

- [ ] Header spacing — icon + title row uses the same gap/margin-bottom as every other widget (`widget-card-title` shared mixin, `gap: space(xs)` as of Sprint A3, previously `space(xxs)`); title icon renders at `size="md"` (13px, Sprint A3 — previously `size="sm"`/11px, a noticeable size mismatch against the wireframe's 14px `.wt i`). Firm Wins' per-row category icon (`.wric i`) stays `size="sm"` — that one was already an exact match, not part of this fix.
- [ ] Padding — card padding is identical across all four (`widget-card` shared mixin, `space(sm)`).
- [ ] Border radius — identical across all four (`radius(large)`, shared mixin).
- [ ] Events' icon-to-text row gap reads slightly more open than the other three widgets' row gap (Sprint A3: `space(sm)`, a closer match to the wireframe's `.ev-row` 7px than the other widgets' 6px — this is a deliberate, wireframe-driven difference, not an inconsistency).
- [ ] Shadow — none of the four widget cards have a box-shadow, on hover or otherwise (deliberate — see `_widgetCard.scss`'s Sprint 7 docblock note; these are static content, not controls).
- [ ] Empty state — each widget shows `EmptyState` with its own specific copy ("No upcoming events", "No new joiners in the last 90 days", "No regulatory updates", "No firm wins yet") when its data array is empty, using the same `EmptyState` component, not a bespoke inline message.
- [ ] Loading state — confirmed page-level only (a full-page `Skeleton`), NOT per-widget. This is intentional, documented architecture debt (`ARCHITECTURE_DEBT.md` entry 1), not a defect — do not flag "each widget doesn't show its own skeleton" as a new bug.
- [ ] Error state — confirmed no per-widget error UI; a failed fetch shows the widget's own `EmptyState` (data defaults to `[]`) plus a page-level notice banner naming the failed section. Same note as above: intentional, not a defect.
- [ ] Typography — every below-`label`-floor text (dates, sub-labels, tags) uses `label` consistently across all four widgets, per `DESIGN_TOKEN_DEBT.md` entry 3's documented (open) approximation — not a mix of `label` in some widgets and something else in others.
- [ ] Icon sizing — title-row icons render at the same size across all four widgets; fixed-dimension boxes (date box, avatar, icon chip) use each widget's own documented fixed px size (these are intentionally NOT spacing-token-driven — see each widget's own docblock).

## Accessibility

- [ ] Keyboard navigation — Tab through the entire Home page (nav → hero cards → hub cards → dashboard widgets → footer) with no trap, no skip, no element reachable by mouse but not keyboard.
- [ ] Focus states — every interactive element (`HubCard`, `QuickLinksGrid` tiles, `NavigationItem`, `Header`'s user menu, any `Button`) shows a visible focus ring on keyboard focus (`:focus-visible`) and nothing extra on mouse click.
- [ ] Screen reader labels — decorative icons (`aria-hidden="true"`) are never announced; meaningful icon-only controls have an accessible name; `ErrorState` uses `role="alert"`.
- [ ] Contrast — spot-check every text/background pairing introduced or changed this sprint. **Known failure:** `accentForeground` on `accentBackground` (2.57:1) — see `ARCHITECTURE.md` §28. All other pairings should meet 4.5:1 (normal text) / 3:1 (large text, UI components).
- [ ] Reduced motion — with OS-level "reduce motion" enabled, confirm `HubCard`'s hover lift, `QuickLinksGrid`'s hover wash, and every other transition either stop or collapse to nearly instant (global `prefers-reduced-motion` rule in `global.scss`).

## Responsive

Verify layout, spacing, and column counts at each width (resize the browser or use devtools' responsive mode):

- [ ] 1920px
- [ ] 1440px
- [ ] 1280px
- [ ] 1024px
- [ ] 768px
- [ ] 480px

At every width: no horizontal scrollbar, no overlapping content, no orphaned/partial grid column, `Container`'s gutter widens appropriately (16px mobile → 24px tablet+, per `Container`'s own token-driven breakpoints).

## Themes

- [ ] Light Mode — the only mode with an end-user-facing entry point today; verify against the wireframe directly.
- [ ] Dark Mode — `ThemeProvider` supports a `mode` prop end-to-end (`lightColors`/`darkColors`, `shadows`/`darkShadows`) but there is still no UI toggle anywhere in the shipped product (documented since Sprint 1 — not a Sprint 7 gap). If testing dark mode, it must be exercised programmatically (`mode="dark"` passed directly), not via any in-product control.
- [ ] Theme switching — when `onThemeChanged` fires (a real SharePoint tenant theme change), the whole page re-renders with the new `sharePointTheme` — confirm no stale colors persist on any card, button, or background.

## Performance

- [ ] No unnecessary renders — the page re-renders on exactly two triggers: `onInit()`'s data fetch resolving, and a tenant theme change. Confirm no component re-renders outside those two events (React DevTools Profiler).
- [ ] No duplicate CSS — shared visual patterns route through a shared mixin/partial (`_widgetCard.scss`, `_heroCard.scss`) rather than being copy-pasted per component; spot-check any newly added component follows this.
- [ ] No console errors — open the browser console on page load and confirm zero errors/warnings, including React's own (key warnings, prop-type warnings, etc.).
- [ ] Lighthouse-ready where applicable — no obvious blockers to a Lighthouse run (broken images, missing alt text, render-blocking resources) — a full Lighthouse audit requires a deployed URL and is out of scope for local verification.
