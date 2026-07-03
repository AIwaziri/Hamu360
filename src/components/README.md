# components

Shared, reusable, presentational React components used by more than one web part or extension (buttons, cards, form controls, etc.).

Rules for this folder:
- No SharePoint/PnPjs/service calls here — components take data via props only. If a component needs data, a container in the consuming web part fetches it and passes it down.
- No feature- or page-specific components (e.g. a "CaseSummaryCard") — those live inside the web part that owns that feature, not here.
- Each component gets its own subfolder: `Button/Button.tsx`, `Button/Button.module.scss`, `Button/IButtonProps.ts`, `Button/index.ts`.

Intentionally empty in Sprint 0 — no UI has been built yet.
