# hooks

Shared custom React hooks (e.g. `useCurrentUser`, `useDebouncedValue`) that wrap the `services/` layer or provide generic reusable behavior.

Rules for this folder:
- Hooks call into `services/` via the interfaces in `src/services`, never into `services/SharePoint` or `services/Mock` directly — that keeps hooks environment-agnostic.
- Feature-specific hooks live with the feature, not here.

Intentionally empty in Sprint 0 — no UI has been built yet.
