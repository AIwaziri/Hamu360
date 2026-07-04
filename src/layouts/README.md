# layouts

Structural shell components (page chrome, grid scaffolding, responsive containers) shared across web parts. Layouts arrange content; they do not know what the content is.

Rules for this folder:
- No business content, no page-specific composition (no dashboards, no hero banners) — that belongs to the feature that uses a layout, not the layout itself.
- No hardcoded content (nav destinations, copy, etc.) — content-shaped data comes in as props from `src/config` or a real page, never lives inside a layout component's own source.

## What's here (Sprint 2 — application shell)

- **`AppShell`** — top-level frame: `Header` + skip link + `MainLayout` + `Footer` in a full-height flex column. See its own docblock for the full explanation of why Sprint 4 (audience targeting) and Sprint 6 (real routing/data) extend it without a rewrite.
- **`Header`** — sticky top chrome: logo, `Navigation`, user menu placeholder, mobile hamburger toggle.
- **`Navigation`** / **`NavigationItem`** — data-driven nav list and its standalone, reusable item primitive. Neither knows what the seven destinations are — see `src/config/navigation.ts`.
- **`Footer`** — the dark firm-branding band.
- **`MainLayout`** — the page-content wrapper `AppShell` places between `Header` and `Footer`. Still no business content of its own.

No routing exists yet (`NavigationItem` renders a `<button>`, not a real `<a href>`), and no audience-targeting exists yet (`Navigation` renders whatever `items` array it's given, unfiltered). Both arrive as data flowing into existing props in later sprints, not as changes to these components — see `AppShell`'s docblock.
