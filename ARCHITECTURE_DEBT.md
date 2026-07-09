# Architecture Debt

This is the single register of every place the SPFx experience layer (`src/`) shipped a working, coarser-grained solution than the codebase's own architecture intended, because the ideal fix would have required changing a component whose props/interface a given sprint's brief explicitly protected. It exists for the same reason `DESIGN_TOKEN_DEBT.md` does — so the compromise is visible in one place instead of buried in a component comment, with a ready-made backlog for whoever owns the affected layer, rather than a silent gap someone has to rediscover later.

**Process:** same as `DESIGN_TOKEN_DEBT.md` — when a sprint hits a gap between what the architecture anticipated and what a scope boundary allowed it to build, the full explanation belongs here, not in a long inline comment. The component's own code should carry only a short comment naming which entry applies (e.g. `// See ARCHITECTURE_DEBT.md #1 — coarse-grained loading/error state`).

Nothing in this file blocks a sprint from shipping. Every entry below is a shipped, working page — this is a backlog for whoever owns the affected architecture layer, not an open defect list.

---

## 1. `AsyncState<T, E>` was never adopted — loading/error state is page-level, not per-widget

**Origin:** anticipated in Sprint 0's `ARCHITECTURE.md`; the gap became concrete and was first logged during Sprint 6 verification.

**Component(s) affected:** every Sprint 2–5 leaf component that takes a plain `T[]`/object prop — `AnnouncementsFeed`, `QuickLinksGrid`, `PartnerMessageCard`, `EventsWidget`, `NewJoinersWidget`, `RegulatoryUpdatesWidget`, `FirmWinsWidget` — plus the three composition-root components introduced to work around it: `Hamu360ShellWebPart.ts`, `Hamu360Shell.tsx`, and `HomePage.tsx`.

**Current behavior:** `src/types/common.ts` has exported `AsyncState<T, E> = {status:'idle'} | {status:'loading'} | {status:'success';data:T} | {status:'error';error:E}` since Sprint 0, but no component prop anywhere in `src/webparts/hamu360Shell/components` has ever been typed with it. Every leaf widget still takes a plain `T[]` (or, since Sprint 6, an `EmptyState`-aware `T[]`) with no way to express "this specific section is still loading" or "this specific section failed" independently of every other section on the page.

Sprint 6's brief required real loading/error handling once mock data was replaced with real network calls, but also explicitly forbade reshaping `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`'s (or their children's) props to accommodate it. With per-widget `AsyncState` off the table, loading/error handling was pushed up to the one layer that could still change freely — `HomePage`/`Hamu360ShellWebPart` — and implemented coarse-grained instead:

- One whole-page `Skeleton` treatment for `pageStatus === 'loading'`.
- One whole-page `ErrorState` for `pageStatus === 'error'`, and only for the single page-critical failure (`currentUser`).
- One page-level notice banner listing `failedSections` by name when any of the other eight datasets fails — not a per-widget error state inline where that widget would normally render.

This works and is honestly documented (`HomePage.tsx`'s own docblock walks through the reasoning), but it is a real loss of granularity versus what the architecture intended: a user cannot tell, from the page itself, that specifically "Firm Wins" failed to load without reading the banner's text — the `FirmWinsWidget` card itself just quietly shows its `EmptyState` ("No firm wins yet"), which looks identical whether the List legitimately has zero rows or the fetch failed and `Hamu360ShellWebPart.onInit()` caught it. The Sprint 6 closeout's own `SharePointPartnerMessageService` fix adds a second, narrower instance of the same underlying issue: `partnerMessage: undefined` is now overloaded to mean both "the fetch failed" and "she genuinely has no post this week," and only the page-level `failedSections` banner (not the card itself) distinguishes them.

**What the ideal fix would require:** wiring `AsyncState<T, E>` all the way down through `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`'s child props, so each leaf widget receives its own `AsyncState<IEvent[]>` (etc.) instead of a bare array, and renders its own `Skeleton`/`EmptyState`/`ErrorState` branch internally based on `status`. This is a real prop-shape change to every affected component listed above — not a small diff, and exactly the kind of change Sprint 6's scope boundary was written to defer. It would also mean deciding whether `Hamu360ShellWebPart.onInit()` still uses one `Promise.allSettled` batch (mapping each settled result into its corresponding `AsyncState`) or whether individual widgets start managing their own fetch lifecycle — a design question, not just a mechanical prop change.

**Recommended sprint:** flagged as a candidate for Sprint 7 ("Polish") given the natural fit with a hardening/refinement pass, but this is a suggestion for whoever plans Sprint 7, not a scheduling decision made here. It could equally be judged not worth the prop-surface churn if per-widget loading/error granularity turns out not to matter in practice once real usage data exists — that judgment call belongs to product/COO sign-off, not this file.

---

## Summary table

| #   | Gap                                                                | First identified                            | Components affected                       | Recommended sprint (candidate, not decided)   |
| --- | ------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| 1   | No per-widget `AsyncState<T,E>` — loading/error is page-level only | Sprint 0 (anticipated); Sprint 6 (surfaced) | 7 leaf widgets + 3 composition-root files | Sprint 7 — Polish (suggested, needs sign-off) |

This table should be updated every time a sprint adds a new instance of an existing entry, or a genuinely new architecture-level gap.
