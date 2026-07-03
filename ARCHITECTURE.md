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
