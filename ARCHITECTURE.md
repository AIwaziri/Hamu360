# Hamu360 — Sprint 0 Architecture

This document explains every non-obvious decision baked into this project foundation. It is meant to be read once by anyone joining the team, and referred back to whenever a decision here seems arbitrary — none of them are.

**Scope reminder:** Sprint 0 is foundation only. There is deliberately no dashboard, no hero, no page, no business/domain component anywhere in this repo. The one web part that exists (`Hamu360Shell`) is a compile-proof placeholder, not a feature — see [§8](#8-the-placeholder-web-part).

---

## 1. Scaffold: SPFx generator, gulp, Node 22

- **Generator:** `@microsoft/generator-sharepoint@1.23.2`, the latest stable release at the time of writing, targeting SPFx `1.23.2`.
- **Node:** pinned to `>=22.14.0 <23.0.0` in `package.json#engines` because that's what SPFx 1.23's toolchain requires — this is not an arbitrary choice, older/newer Node will fail dependency installs or the build itself.
- **Build tool: gulp, not the newer Heft-only pipeline.** Recent SPFx versions offer a newer, esbuild/Heft-based build system as an alternative. This project uses the classic gulp-based `@microsoft/sp-build-web` pipeline (`--use-gulp` at scaffold time) because it is the toolchain with the longest track record, the most complete documentation, and the widest team familiarity — important for an enterprise codebase multiple developers will touch. The tradeoff is slightly slower builds than the newer pipeline; that's acceptable at this stage.
- **React, not "none" or "minimal":** the brief calls for a React frontend, so the web part template is `react`.
- **`--skip-feature-deployment`:** lets a tenant admin deploy the app to all sites without a separate feature-activation step — standard for an internal enterprise app, not a marketplace product.

## 2. Folder architecture (`src/`)

```
src/
  components/   Shared, reusable, presentational React components (no business data fetching)
  hooks/        Shared custom React hooks, thin wrappers over services/
  models/       TypeScript interfaces for domain/business entities
  services/     Interface-first service layer
    Mock/         Concrete implementations used in local dev / tests
    SharePoint/   Concrete implementations backed by real SharePoint/PnPjs calls
  styles/       Shared, non-component-scoped SCSS (variables, mixins, a minimal reset)
  theme/        Fluent UI theme tokens + the SharePoint-theme merge function
  assets/       Shared static assets (icons/logos used by more than one web part)
  utils/        Small, pure, dependency-free helper functions
  layouts/      Structural shell components (page chrome) — content-agnostic
  types/        Generic TypeScript utility types with no business meaning
  config/       Reusable environment/runtime configuration
  webparts/     SPFx-generated, one folder per web part (framework-mandated location)
```

Every one of `components/`, `hooks/`, `layouts/`, and `assets/` is intentionally near-empty right now — each has a `README.md` explaining what belongs there and what doesn't, so the first real feature PR extends an already-understood convention instead of inventing one under time pressure. `models/`, `services/`, `theme/`, `styles/`, `types/`, and `config/` have real (but minimal, non-feature) content — see below.

**Why `models/` vs `types/` are separate folders:** `models/` holds interfaces with business meaning (`ICurrentUser` today; `ICase`, `IDocument`, etc. as features are built). `types/` holds generic utility types with zero business meaning (`Nullable<T>`, `AsyncState<T>`). Conflating the two eventually produces a junk-drawer folder that nobody trusts; keeping them separate means "where does this type belong" always has an obvious answer.

**Why `services/Mock` and `services/SharePoint` are siblings, not a single folder with `*.mock.ts` suffixes:** a directory split makes the two implementations trivially diffable side-by-side in a file tree, and makes it structurally impossible to accidentally ship a file from one into a bundle meant to only contain the other (e.g. via a build-time folder exclusion, if that's ever needed).

## 3. Path aliases

Configured in **two places that must be kept in sync**, because they serve two different tools:

1. **`tsconfig.json` → `compilerOptions.paths`** — used by `tsc` for type-checking and by every editor's IntelliSense. Does **not** affect the emitted JavaScript.
2. **`gulpfile.js` → `build.configureWebpack.mergeConfig({ additionalConfiguration })`** — used by webpack when it bundles the compiled output. This is what actually makes `import x from '@services/...'` work at runtime.

Aliases:

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@models/*`     | `src/models/*`     |
| `@services/*`   | `src/services/*`   |
| `@styles/*`     | `src/styles/*`     |
| `@theme/*`      | `src/theme/*`      |
| `@assets/*`     | `src/assets/*`     |
| `@utils/*`      | `src/utils/*`      |
| `@layouts/*`    | `src/layouts/*`    |
| `@app-types/*`  | `src/types/*`      |
| `@config/*`     | `src/config/*`     |

**Two non-obvious traps we hit while wiring this up, documented so nobody rediscovers them the hard way:**

- **The `types` folder is aliased as `@app-types`, not `@types`.** TypeScript reserves the `@types/` import-specifier prefix for DefinitelyTyped-style ambient declaration packages under `node_modules/@types`, and refuses to resolve a normal import through it (`TS6137: Cannot import type declaration files`). Using `@types` as an alias name compiles as a folder but breaks the moment you try to import anything from it.
- **The webpack alias targets must point at `lib/`, not `src/`.** By the time webpack runs, the gulp `tsc` subtask has already compiled `src/**/*.ts(x)` into `lib/**/*.js` (mirroring the same folder structure), and webpack bundles from that compiled output — it never sees the original `.ts`/`.tsx` files. An alias pointing at `src/` resolves to a directory containing only `.ts` files, which don't match webpack's `resolve.extensions` list, and fails with a silent-looking "Module not found" that has nothing obviously wrong with the alias configuration itself. `tsconfig.json`'s aliases correctly point at `src/` (that's what `tsc` needs); `gulpfile.js`'s aliases correctly point at `lib/` (that's what webpack needs). This asymmetry is intentional, not a copy-paste inconsistency.

## 4. Strict TypeScript

`tsconfig.json` turns on the full `strict` family (`strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `useUnknownInCatchVariables`), plus additional safety nets beyond what `strict: true` covers: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`.

The SPFx generator's default only turns on `noImplicitAny`. For a codebase multiple developers will contribute to over multiple sprints, the full strict family catches entire categories of bugs (null/undefined handling, unreachable code, unsafe indexed access) at compile time instead of in the SharePoint workbench or — worse — production.

## 5. SCSS Modules

SPFx's gulp `sass` subtask already compiles any `*.module.scss` file into a typed, class-name-scoped module (`*.module.scss.ts`, gitignored — regenerated on every build) — this is how `Hamu360Shell.module.scss` works. That part required no extra configuration.

What this foundation adds on top:

- **`src/styles/_variables.scss`** — a spacing/breakpoint scale, meant to be `@import`-ed by feature `.module.scss` files so spacing stays consistent without every component re-declaring magic numbers.
- **`src/styles/_mixins.scss`** — small, generic, feature-agnostic mixins (`truncate-text`, `visually-hidden`, `flex-center`). Nothing here knows about any specific component.
- **`src/styles/global.scss`** — a minimal, non-visual `box-sizing: border-box` reset. It's a plain (non-module) stylesheet by design — it's global, not scoped to one component — and is not auto-injected; a future feature entry point opts in with a single `import '@styles/global.scss'`.

**Known duplication, and why it's left as-is:** `src/theme/tokens.ts` (spacing in TypeScript, for use in `.tsx` files / Fluent UI theme objects) and `src/styles/_variables.scss` (the same spacing scale, in SCSS, for use in `.module.scss` files) currently duplicate the same values. SPFx's default gulp/sass pipeline has no build-time JSON→SCSS bridge wired up, so a single source of truth across both languages isn't free — it would need a custom build step. That's a reasonable thing to add later if/when the token list grows large enough to make manual sync error-prone; for Sprint 0's small token set, the duplication is cheaper than the added build complexity. The comment at the top of `_variables.scss` flags this explicitly.

## 6. ESLint

Base: `@microsoft/eslint-config-spfx/lib/profiles/react` (the officially maintained SPFx + React ruleset — kept as-is rather than replaced, since it encodes a lot of SPFx-specific knowledge like the `@microsoft/eslint-plugin-spfx` and `@rushstack` rules).

Added on top:

- **`eslint-plugin-import` (`plugin:import/recommended`, `plugin:import/typescript`) with `import/order` enabled.** Enforces a consistent import grouping — external packages, then our `@alias/*` internal imports, then relative imports — alphabetized within each group, with the alias group matched via a single regex pattern (`@(components|hooks|...)/**`) so adding a new alias to `tsconfig.json`/`gulpfile.js` also means adding it to this pattern. Import ordering by hand is exactly the kind of thing a large team drifts on without a linter enforcing it, and it keeps import-block merge conflicts rare.
- **`eslint-import-resolver-typescript`**, configured against `tsconfig.json`, so `eslint-plugin-import` understands our path aliases instead of flagging every `@services/...` import as unresolvable.
- **`import/no-unresolved` and `import/named` are disabled.** SPFx's type-only resolution patterns (the generated `*.scss.ts`, the `Hamu360ShellWebPartStrings` loc-string virtual module) trip these rules up with false positives; `tsc` is the actual source of truth for "does this module exist," and it already runs as part of every build.
- **`eslint-config-prettier`, extended last.** Turns off the handful of ESLint stylistic rules (indentation, quote style, etc.) that would otherwise fight with Prettier's own formatting decisions. Prettier owns formatting; ESLint owns code quality — they don't overlap.

## 7. Prettier

`.prettierrc.json`: `printWidth: 120` (matches the line length the SPFx-generated files already use), `singleQuote: true`, `trailingComma: "none"` (matches the no-trailing-comma style already present throughout the generator's own output, minimizing formatting-only diff noise against generated files), `semi: true`, `endOfLine: "lf"` (avoids CRLF/LF churn across contributors on different OSes).

Deliberately **not** wired through `eslint-plugin-prettier` (running Prettier as an ESLint rule) — that pattern makes every formatting nit show up as a lint error and slows down `eslint --fix`. Formatting and linting are kept as two separate, separately-runnable steps (`npm run format` / `npm run lint`), which is both faster and easier to reason about.

## 8. Environment configuration & the Mock/SharePoint service pattern

**`src/config/environment.ts`** is the single source of truth for "what environment am I in, and what should that change." It exposes `resolveEnvironment(isServedFromLocalhost: boolean): IEnvironmentConfig`, returning:

```ts
{ environment: 'local' | 'sharepoint', useMockData: boolean, enableDebugLogging: boolean }
```

`isServedFromLocalhost` comes from SPFx's own `WebPartContext` (it's true in the local workbench, false on a real SharePoint site) — the web part passes it in during `onInit`. Everything that varies by environment reads from this one function's output instead of re-deriving "am I local?" logic in scattered places.

**The service pattern**, demonstrated end-to-end with one deliberately boring, universally-needed capability (`ICurrentUserService` — "who is logged in") rather than any business feature:

- `src/services/ICurrentUserService.ts` — the interface. UI code and hooks depend on **this**, never on a concrete class.
- `src/services/Mock/MockCurrentUserService.ts` — returns fixture data, used in the local workbench where there's no real SharePoint context to call.
- `src/services/SharePoint/SharePointCurrentUserService.ts` — reads `context.pageContext.user`.
- `src/services/ServiceFactory.ts` — the **only** file in the codebase allowed to know both concrete implementations exist. `createCurrentUserService(context, env)` picks one based on `env.useMockData`. As real domain services get added (`ICaseService`, `IDocumentService`, ...), each gets its own factory function here rather than growing one god-function — keeps each service's construction dependencies explicit and independently testable.

This means a future feature component never writes an `if (isLocal)` branch itself — it asks the factory for a service and gets a working implementation either way.

## 9. Theme

`src/theme/tokens.ts` holds placeholder brand colors and a spacing scale — swap these for Hamu360's real brand palette once design provides it; nothing downstream needs to change, since everything reads through `createAppTheme()`.

`src/theme/createAppTheme.ts` exports `createAppTheme(spTheme?: IReadonlyTheme): ITheme`, which layers the **live** SharePoint tenant/site theme (passed in from the web part's `onThemeChanged` callback) on top of our own tokens, falling back to the tokens alone when no SharePoint theme is available yet (local workbench, or before the callback has fired). This is what lets the app automatically match a tenant's custom theme instead of hardcoding colors.

## 10. The placeholder web part

`Hamu360Shell` (`src/webparts/hamu360Shell/`) exists to prove the whole pipeline compiles and runs together — strict TypeScript, path aliases, SCSS Modules, the environment/service pattern, and theme resolution — not to be a feature. It renders one line of text ("Hamu360 — Foundation... Signed in as {name} ({environment})") and nothing else. When Sprint 1 starts building real features, treat this web part as disposable scaffolding, not as a pattern to extend.

## 11. What's intentionally not here

No dashboard, hero, page, or business/domain component or model exists anywhere in this repo — that's Sprint 0's explicit scope boundary, not an oversight. `components/`, `hooks/`, and `layouts/` are empty on purpose; their `README.md` files explain the conventions the first real feature should follow.

## 12. Known, accepted caveats

- **`npm audit` reports vulnerabilities** in transitive dependencies of the SPFx build toolchain itself (`@microsoft/sp-build-web` and friends, e.g. old `request`/`uuid`/`glob` versions). These come from Microsoft's own toolchain, not from any dependency this project chose, and `npm audit fix --force` would downgrade/break the SPFx tooling. This is a known, widely-reported characteristic of the current SPFx generator across the ecosystem, not something specific to this repo.
- **`npm run type-check` needs one prior `npm run build`** on a completely fresh clone, because SCSS Module typings are generated by the gulp `sass` subtask, not by `tsc` alone. See the README's Scripts table.

---

# Sprint 1 — Design System

Sprint 0 built the project skeleton. Sprint 1 builds the visual language every future screen inherits: a complete design token system (`src/theme`) and five generic layout primitives (`src/components`). No feature, page, dashboard, or business component exists yet — that remains out of scope until a later sprint. This section documents the _why_ behind the design system; the _what_ is documented inline in each file's own docblock.

## 13. Design token strategy

**One canonical source, two delivery mechanisms.** Every design decision — a color, a font size, a spacing step, a shadow — is defined exactly once, in TypeScript, under `src/theme/*.ts`. Nothing downstream is allowed to invent its own value. From that single TypeScript source, two different delivery mechanisms reach two different kinds of consumer:

1. **CSS custom properties**, for almost everything. `ThemeProvider` (`src/theme/ThemeProvider.tsx`) converts the active theme's token object into a flat `--h360-*` variable map (`cssVariables.ts`) and sets it on its own root DOM element at runtime. Every `.module.scss` file reads these variables — directly via `var(--h360-color-primary)`, or through the ergonomic SCSS aliases in `src/styles/_tokens.scss` (`$color-primary`, `space(md)`, `radius(pill)`, ...). This is what makes dark mode possible without touching a single component: swap the variable values at the root, and every consumer downstream re-renders with the new theme for free.
2. **Literal SCSS values**, only where CSS custom properties are structurally impossible: breakpoint thresholds (`src/styles/_breakpoints.scss`) and the breakpoint-keyed parts of the grid system (`src/styles/_grid.scss`). CSS custom properties cannot be referenced inside an `@media` feature query per spec — there is no way around this — so these two files hand-mirror the relevant numbers from `breakpoints.ts`/`grid.ts`. This is the same tradeoff Sprint 0 already accepted and documented for its original, much smaller spacing scale (§5); Sprint 1 is the "revisit once the token list grows" moment that section predicted, and the answer it arrived at is: CSS variables for everything _except_ the one category (breakpoints) where they genuinely cannot work.

**Nothing in between.** No component-local hex code, no one-off `padding: 13px`, no inline `style` prop. See §20 ("How future components must consume tokens") for the enforcement mechanics, and `src/theme/colors.ts`'s docblock for why color specifically only allows one file to contain a raw value at all.

## 14. Wireframe fidelity: what was reproduced exactly vs. systematized

The brief asks for "99% visual accuracy" against the approved wireframe (`HOS_All_Departments_Wireframe_v1.html`) — every color, typography, radius, and shadow token in this design system was extracted directly from that file's own `:root` custom properties and computed styles, not approximated:

- **Colors** (`colors.ts`) — the wireframe's `--nv`/`--nv2`/`--g`/`--gl`/`--gd`/`--t1`/`--t2`/`--t3`/`--sf`/`--wh`/`--bd`/`--red`/`--redbg`/`--grn`/`--grnbg`/`--blu`/`--blubg`/`--amb`/`--ambbg` custom properties map one-to-one onto `lightColors`. Nothing was invented.
- **Typography** (`typography.ts`) — `headingL`/`headingM`/`headingS`/`title` reproduce the wireframe's `.stat-num`/`.htitle`/`.shell-title`(`.mn`)/`.hub-hname` classes' exact `font-size`/`font-weight`.
- **Radius** (`radius.ts`) — the 4–10px range spans the wireframe's own observed `border-radius` values.
- **Shadows** (`shadows.ts`) — the wireframe's one `box-shadow` (`0 4px 24px rgba(13, 31, 60, 0.1)`) is kept verbatim as the `hover` elevation token, and every other elevation step is the same navy tint at a different blur/alpha.
- **Grid** (`grid.ts`) — `maxContentWidth: 1180` and the mobile `containerPadding` (16px) are exact matches for the wireframe's `.shell { max-width: 1180px; padding: 24px 16px; }`.

**Spacing and motion were deliberately not reproduced literally.** The wireframe is a hand-tuned static mockup with one-off gap/padding values like 5, 7, 9, 11, 13, 14, 15, 18px, and no animation to anchor motion tokens to at all. A design system's job is to replace that kind of ad hoc fine-tuning with a small, disciplined scale that every future component rounds to — see `spacing.ts`'s docblock for the full reasoning. Colors/typography/radius/shadows are the brand and are reproduced exactly; spacing is infrastructure and is systematized on purpose.

## 15. Theme architecture

`ThemeProvider` is the root of the design system — every web part must mount exactly one, above anything that reads a token. It does two independent things, deliberately kept separate:

1. Applies the `--h360-*` CSS variables for the active `IDesignTokens` object (`lightTokens` or `darkTokens`, from `tokens.ts`) to its own root element. This is the styling mechanism for every primitive in `src/components` and every future feature component.
2. Wraps children in Fluent UI's own `ThemeProvider` (`applyTo="none"`, so it never fights for control of `document.body`), themed via `createAppTheme()`. This exists only for the small number of Fluent primitives this app still composes (icons, and any future Fluent control a component wraps internally) — it is a compatibility seam, not a second design system. `createAppTheme`'s docblock says this explicitly so nobody mistakes it for the "real" theming mechanism.

`useAppTheme()` is the escape hatch for the rare case a component needs a token's raw value in JS (a canvas/SVG measurement, for instance) rather than CSS — everything else should go through a `.module.scss` file.

**Dark mode is fully wired, not stubbed.** `colors.ts` exports both `lightColors` and `darkColors`, `shadows.ts` exports both `shadows` and `darkShadows`, and `ThemeProvider` already accepts a `mode` prop that switches between them end-to-end. There is no dark-mode _toggle_ anywhere in the product yet — that's a future sprint's UI work — but the token layer underneath it is complete today. The dark palette is not a guess: the wireframe's own header chrome already proves navy-surface + gold-accent + white-text works (`.hos`/`.htitle`), and its active selector chip already proves navy-text-on-gold-background works (`.sel-btn.active .av`) — dark mode reuses those exact pairings rather than inventing a new palette from nothing.

## 16. Responsive philosophy

**Mobile-first, no exceptions.** Every responsive rule in this codebase is written as "base styles for the smallest viewport, then layer on larger-viewport overrides with a `from-*` mixin" — never the reverse. `src/styles/_breakpoints.scss`'s `from-mobile`/`from-tablet`/`from-laptop`/`from-desktop` mixins are `min-width` only; there is no `max-width` mixin in the system, because writing one would make it too easy to reach for desktop-first thinking.

**`Grid`'s column counts are mobile-first by construction, not by convention.** A consumer passes one `columns` value (the count from `laptop` up); `Grid.module.scss` bakes in the mobile/tablet step-down for every option (see `Grid.module.scss`'s comment for the exact ramp per column count). There is no separate "responsive columns" API to remember to use — the default behavior _is_ the responsive behavior.

**Breakpoints are `px`-based, not viewport-relative, and not delivered as CSS variables** — see §13's second delivery mechanism, and `breakpoints.ts`'s docblock for the full reasoning.

## 17. Typography decisions

**`px`, not `rem`.** This is the single most SPFx-specific decision in the whole design system, and it's easy to get wrong if you're used to a standalone web app: an SPFx web part renders directly into the _host_ SharePoint page's DOM — there is no isolated iframe or shadow root by default. A `rem` value would be relative to whatever font-size the tenant's SharePoint theme happens to set on `<html>`, which this app has no control over and cannot assume is `16px`. `px` is the only unit guaranteed to render identically regardless of what tenant, site, or page this app is embedded into. See `typography.ts`'s docblock.

**Segoe UI first, no webfont.** Most Hamu360 users are on managed Windows/Microsoft 365 devices, where Segoe UI is already the native system font — using it first means zero webfont download, zero FOUT/FOIT, and no new dependency, while still looking distinctly more considered than the wireframe's placeholder `Arial, sans-serif` (a wireframing convenience, not a deliberate brand choice).

**The type scale is anchored to the wireframe wherever the wireframe already establishes a value** (`headingL`/`headingM`/`headingS`/`title` — see §14) and interpolated from the same modular scale for the roles the wireframe doesn't need (`display`, `button`, `code`). `button` is deliberately larger/bolder (13px/600) than the wireframe's compact 11.5px chip text: the wireframe's chips are miniature UI chrome, but `button` governs primary/secondary CTAs across the whole future product, which must stay comfortably legible per WCAG typography guidance. Small chip/tag controls should reach for `label`, not `button`.

## 18. Color philosophy

**Semantic tokens only — never a raw value outside `colors.ts`.** A component asks for `primary` or `danger` or `textOnPrimary`, never `#0d1f3c`. This is what makes theming (and eventually dark mode) possible without touching component code, and it's enforced structurally: `colors.ts`'s raw palette (`palette`) is a module-private `const`, never exported, never re-exported from the `theme` barrel. There is exactly one file in the entire codebase where a color literal is allowed to appear.

**The semantic list extends the brief's example set by a deliberate, small amount** — `successBackground`/`warningBackground`/`dangerBackground`/`info`/`infoBackground` (the wireframe pairs every status color with a pastel background tint for badges, and has a fourth "info" blue distinct from success/warning/danger), `surfaceSubtle` (the wireframe uses two distinct light neutrals for elevation, not one), and `textOnPrimary` (required for WCAG AA contrast wherever text sits on a `primary`/`accent`-colored background). Every addition is justified in `colors.ts`'s docblock against a specific, named piece of the approved wireframe — none is speculative.

## 19. Folder responsibilities (Sprint 1 additions)

No new top-level folder was created — Sprint 0's architecture is unchanged. Sprint 1 fills in folders that were previously empty-by-convention, and adds files to `theme`/`styles` that were previously placeholders:

- **`src/theme`** — now the complete token system: `colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, `breakpoints.ts`, `grid.ts`, `zIndex.ts`, `opacity.ts` (one token category per file, no cross-category leakage), `tokens.ts` (pure composition — assembles `lightTokens`/`darkTokens` from the files above, contains no values of its own), `cssVariables.ts` (the TS-token → CSS-variable flattening bridge), `ThemeProvider.tsx` (the React root of the system), and the Sprint-0-era `createAppTheme.ts` (now sourcing its colors/font from `colors.ts`/`typography.ts` instead of its old inline placeholder values).
- **`src/styles`** — `_breakpoints.scss` and `_grid.scss` are new (the literal-value SCSS mirror from §13); `_tokens.scss` is new (the SCSS-side ergonomic bridge — variables/functions/mixins that wrap `var(--h360-*)`, never a literal); `_string-utils.scss` is new (a `capitalize()` Sass function, used to generate camelCase utility class names — see §20); `_mixins.scss` gained `focus-ring`, `elevation`, and `motion-safe`; `global.scss` grew from a one-rule `box-sizing` reset into the full reset the brief asks for (typography defaults, scrollbar styling, selection styling, focus handling, reduced-motion), still opt-in via explicit import, not auto-injected; `_variables.scss` is now a pointer file (its old hardcoded spacing/breakpoint values are superseded — see the file itself for where each moved).
- **`src/components`** — five generic layout primitives (`Container`, `Section`, `Stack`, `Grid`, `Spacer`) — see §21. `README.md` updated accordingly; the "no business components" rule is unchanged and restated there.
- **`src/hooks`** — `usePrefersReducedMotion`, the folder's first real content — a genuinely generic, infrastructure-level hook (not a feature hook), consistent with what the folder's Sprint 0 `README.md` always said belonged there.

`src/models`, `src/services`, `src/config`, `src/layouts`, `src/assets`, `src/utils` (aside from two small new generic helpers, `capitalize` and reused `classNames`) are untouched from Sprint 0.

## 20. How future components must consume tokens

Every rule below exists because Sprint 1's own build caught the mistake it prevents — none of this is theoretical:

1. **Read tokens through `.module.scss`, not inline styles.** A component's SCSS Module imports `src/styles/_tokens.scss` and uses `$color-*` variables / `space()`, `radius()`, `shadow()`, `duration()`, `ease()`, `motion()`, `z()`, `token-opacity()` functions, or the `typography($role)` mixin. It never writes a literal color, px value, or `rgba(...)`.
2. **A closed set of prop values maps to a closed set of CSS classes — never a dynamically-interpolated class name string.** Every primitive in `src/components` maps its enum-like props (`gap`, `align`, `direction`, `maxWidth`, ...) through an explicit `Record<Token, string>` lookup table (e.g. `Stack.tsx`'s `gapClassNames`), not a template string like ``styles[`gap-${gap}`]``. This isn't a style preference: under this project's strict TypeScript config, a dynamically-computed key into a CSS Modules import has no way to be checked against the module's actual exported class names, so a typo or a renamed class silently produces `undefined` — an invisible layout bug — instead of a compile error. An explicit `Record` must list every value of the token's union type, so TypeScript itself fails the build if a new token is added (or a class renamed) without updating the map. This pattern is mandatory for every future primitive/component with token-driven variant props.
3. **Every CSS Modules class name must be camelCase.** SPFx's `sass` build task warns on any class name containing a hyphen. Utility classes generated from token keys (`gap-md`, `direction-row`, ...) violate this the moment a multi-word class is built from string interpolation — the fix used throughout `src/components/*/*.module.scss` is `_string-utils.scss`'s `capitalize()` Sass function inside the `@each` loop (`.gap#{capitalize($key)}` → `.gapMd`), never a raw hyphenated class.
4. **No `style` prop on any design-system primitive.** `Container`/`Section`/`Stack`/`Grid` deliberately do not expose a `style` prop — only `className`, for the rare composition case a token-backed prop doesn't cover. This is also a defense-in-depth measure for SharePoint's CSP: some tenant configurations restrict inline styles, so avoiding them isn't only a code-quality preference here.
5. **`ThemeProvider` must be mounted once, above everything.** A component that calls `useAppTheme()` outside a `ThemeProvider` throws immediately (see its implementation) rather than silently rendering unthemed — a deliberate fail-fast choice over a default-theme fallback, since a component silently falling back to _some_ theme is a much harder bug to notice than an immediate, obvious error during development.

## 21. The five primitives

Each is documented in full in its own component's docblock; summarized here for reference:

| Primitive   | Owns                                                                                | Does not own                                            |
| ----------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `Container` | Horizontal max-width + responsive gutter, centered                                  | Vertical spacing                                        |
| `Section`   | Vertical rhythm (`padding-block`) between page regions                              | Horizontal layout                                       |
| `Stack`     | Flexbox spacing/alignment between children (`gap`, `direction`, `align`, `justify`) | Max-width, grid layout                                  |
| `Grid`      | CSS Grid with mobile-first column counts                                            | Fixed pixel widths, non-grid layout                     |
| `Spacer`    | Explicit fixed or flexible spacing when `Stack`'s `gap` isn't the right tool        | Any content — it is always a leaf, never takes children |

All five: TypeScript strict, `React.forwardRef` (so a consumer can always attach a ref to the underlying DOM node), a constrained `as` prop for semantic-HTML flexibility, zero inline styles, zero raw values — every visual property traces back to a token via the rules in §20.

## 22. What's still not here

No dashboard, hero, page, card, button, or any component with visual "personality" exists anywhere in this repo. That remains out of scope until the first real feature sprint — which should build strictly on top of `src/theme`'s tokens and `src/components`'s primitives, never bypass them with a one-off style. If a future component needs a token category this design system doesn't yet expose through `_tokens.scss`, extend that file — don't reach for a literal value as a shortcut.

---

# Sprint 1 Integration Patch — Design System Showcase (temporary)

Sprint 1 built the design system but never mounted it anywhere — the SharePoint web part still rendered Sprint 0's static placeholder. This patch wires `ThemeProvider` into the web part's actual React root and replaces the placeholder with a **temporary verification page** that exercises every Sprint 1 primitive and token category live inside SharePoint, so the design system can be reviewed visually before Sprint 2 feature work begins.

## 23. What changed

- **`Hamu360ShellWebPart.ts`** — no longer computes an `ITheme` itself. It now holds the raw `IReadonlyTheme | undefined` from `onThemeChanged` and passes it straight through as a `sharePointTheme` prop; `ThemeProvider` (not the web part) is responsible for turning that into a Fluent theme. `onThemeChanged` now calls `this.render()` — necessary because `sharePointTheme` is a React prop consumed by a `useMemo`, unlike Sprint 0's direct CSS-custom-property mutation, which never needed a re-render.
- **`Hamu360Shell.tsx`** — converted from a class component to a function component (matching the "React Functional Components, Hooks only" engineering standard the rest of the design system already follows). It is now the permanent app root: it owns light/dark mode state (`React.useState`) and mounts `<ThemeProvider>` — exactly once, above everything — per `ThemeProvider`'s own docblock. This file's job (mount the provider, own theme mode) is permanent; the child it renders is not.
- **`IHamu360ShellProps.ts`** — dropped the precomputed `theme: ITheme` prop, added `sharePointTheme?: IReadonlyTheme`.
- **`Hamu360Shell.module.scss`** — deleted. It styled the old placeholder directly; nothing in the new tree needs page-level styles of its own.
- **`loc/en-us.js` / `loc/mystrings.d.ts`** — removed `FoundationTitle`/`FoundationSubtitle`, the placeholder's old copy. Nothing references them anymore.
- **New: `src/webparts/hamu360Shell/components/DesignSystemShowcase/`** — the showcase itself (`DesignSystemShowcase.tsx`, `.module.scss`, props, barrel).

## 24. Why the showcase lives where it does

`src/components` is reserved for generic, reusable primitives (per its own `README.md`) — a page that demonstrates those primitives is not itself a primitive, so it does not belong there. It lives inside the web part that owns it (`src/webparts/hamu360Shell/components/DesignSystemShowcase`), the same place Sprint 0 established for anything web-part-specific. This also makes it trivially deletable: removing the `DesignSystemShowcase` folder and reverting `Hamu360Shell.tsx`'s two-line render is the entire cleanup, once verification is done — no other file references it.

## 25. What the showcase demonstrates, and how

Every value on the page is token-driven — the showcase itself follows the same "no hardcoded values, explicit `Record` lookups over dynamic class-name strings" rules as the rest of the design system (§20), just scoped to one throwaway file instead of shared infrastructure:

- **All five primitives** — the whole page is a `Container` (`maxWidth="desktop"`, 1180px, matching the wireframe), each block is a `Section`; a dedicated "Layout primitives" section additionally demonstrates `Stack` (row + wrap), `Grid` (`columns={4}`, mobile-first — resize the browser to see the column ramp change live), and `Spacer` (both flexible and fixed).
- **Typography** — every one of the 13 type-scale roles, rendered with its real token via the same `typography()` SCSS mixin a future feature component would use. (Caught and fixed during this patch: the mixin expects kebab-case role names — `heading-xl`, not `headingXl` — matching the CSS variable names `cssVariables.ts` generates; several classes initially used the wrong casing and silently fell back to unstyled text. Every `@include typography(...)` call in the showcase's SCSS uses the kebab-case form.)
- **Color** — all 22 semantic color tokens as swatches.
- **Spacing** — the full scale as proportional width bars.
- **Border radius** and **elevation/shadows** — every token, applied to an identical box for direct comparison; the `hover` shadow swatch is a verbatim match for the wireframe's one observed `box-shadow` value.
- **Responsive behavior** — the `Grid columns={4}` demo's mobile-first ramp (1 column below tablet, 2 from tablet, 4 from laptop) is directly visible by resizing the window; `Container`'s gutter widening (16px → 24px at tablet) is visible in the page's own outer padding.
- **Light/dark theme** — a plain `<button>` (not a design-system primitive; Sprint 1 explicitly forbids a `Button` primitive, so this is page-local markup, not a new shared component) flips `Hamu360Shell`'s local `mode` state between `'light'` and `'dark'`, which flows into `ThemeProvider`'s `mode` prop. This is the "temporary developer switch" the brief asked for — there is still no dark-mode affordance anywhere in the permanent product; this button ships only as long as the showcase does.

## 26. Removing this patch

When Sprint 2 feature work is ready to begin:

1. Delete `src/webparts/hamu360Shell/components/DesignSystemShowcase/`.
2. In `Hamu360Shell.tsx`, replace the `<DesignSystemShowcase ... />` child with whatever Sprint 2 actually renders (the `<ThemeProvider>` wrapping it stays — that part of this patch is permanent).
3. Nothing else references the showcase, so no other cleanup is required.
