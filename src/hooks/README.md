# hooks

Shared custom React hooks (e.g. `useCurrentUser`, `useDebouncedValue`) that wrap the `services/` layer or provide generic reusable behavior.

Rules for this folder:
- Hooks call into `services/` via the interfaces in `src/services`, never into `services/SharePoint` or `services/Mock` directly — that keeps hooks environment-agnostic.
- Feature-specific hooks live with the feature, not here.

## What's here (Sprint 1)

- `usePrefersReducedMotion` — JS-side reduced-motion signal for the rare case an animation is driven from JS rather than CSS. See its docblock; most components should rely on the CSS-only handling in `src/styles/global.scss` instead.

Still no feature/business hooks — those arrive with the first real feature, per Sprint 0/1 scope.
