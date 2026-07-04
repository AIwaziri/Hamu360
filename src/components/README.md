# components

Shared, reusable, presentational React components used by more than one web part or extension.

Rules for this folder:
- No SharePoint/PnPjs/service calls here — components take data via props only. If a component needs data, a container in the consuming web part fetches it and passes it down.
- No feature- or page-specific components (e.g. a "CaseSummaryCard") — those live inside the web part that owns that feature, not here.
- No hardcoded style values — every visual property comes from a `@theme` token, consumed through a `.module.scss` file (see `src/styles/_tokens.scss` for the SCSS-side bridge).
- Each component gets its own subfolder: `Button/Button.tsx`, `Button/Button.module.scss`, `Button/IButtonProps.ts`, `Button/index.ts`.

## What's here (Sprint 1 — design system primitives only)

Generic layout primitives, and nothing else — no buttons, cards, or any component with business/visual "personality". Each is documented in its own file's docblock:

- **`Container`** — horizontal max-width + responsive gutter wrapper.
- **`Section`** — vertical rhythm (`padding-block`) between page regions.
- **`Stack`** — flexbox layout box; the primary tool for spacing between children.
- **`Grid`** — CSS Grid layout box with mobile-first column counts.
- **`Spacer`** — explicit fixed or flexible spacing when `Stack`'s `gap` isn't the right tool.

Every application/business/page component (Cards, a Dashboard, a Hero, ...) is still out of scope — those arrive with a real feature sprint, built **on top of** these primitives and the tokens in `src/theme`, never bypassing them with a one-off style.

## Sprint 2 additions

Sprint 2 (the application shell — Header/Navigation/Footer) needed generic text, icon, and interactive-control primitives that Sprint 1 explicitly deferred. These are still generic/presentational/business-agnostic — no `CaseSummaryCard`-style component was added — so they extend this folder rather than living somewhere else:

- **`Button`** — presentational button primitive (`primary`/`secondary`/`ghost`/`icon` variants). No click behavior of its own; every consumer supplies its own `onClick`.
- **`Icon`** — wraps a Tabler Icons glyph. See `Icon/ensureTablerIconFont.ts` for a flagged, unreviewed third-party CDN dependency this introduces — read that file before Sprint 6 sign-off.
- **`Typography`** — renders any role from the type scale (`src/theme/typography.ts`) as text, with an explicit `as` element so visual size (`role`) and document outline level (`as="h1"`, etc.) stay independently controllable.
