'use strict';

const build = require('@microsoft/sp-build-web');
const path = require('path');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
// src/styles/global.scss is intentionally a plain (non-module) stylesheet —
// a shared reset that isn't scoped to one component — so the sass task's
// "should this be a .module.scss?" nudge doesn't apply here.
build.addSuppression(`Warning - [sass] src/styles/global.scss: filename should end with module.sass or module.scss`);
// Sprint 6: `Skeleton.module.scss`'s `@keyframes skeleton-pulse` is a kebab-case
// animation name, not an exported CSS class — the sass task's camelCase check
// doesn't distinguish the two. Same category of false positive as the
// `ms-Grid` suppression above (a real, correct identifier the type-safety
// nudge doesn't apply to).
build.addSuppression(
  `Warning - [sass] The local CSS class 'skeleton-pulse' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

// Path aliases used across the codebase (e.g. `import { X } from '@services/SharePoint'`).
// These must be declared in TWO places that serve two different tools:
//   1. tsconfig.json -> "compilerOptions.paths"   (type-checking / IntelliSense only)
//   2. here (webpack resolve.alias)               (what actually ships in the bundle)
// TypeScript's `paths` never touches the emitted JS, so without this webpack block the
// aliases would type-check fine and then fail at runtime with "Module not found".
//
// Point these at `lib/`, NOT `src/`: by the time webpack runs, the gulp `tsc` subtask
// has already compiled `src/**/*.ts(x)` to `lib/**/*.js` (mirroring the same folder
// structure), and webpack bundles from that compiled output — it never sees the
// original .ts/.tsx files, so an alias pointing at `src/` resolves to files with no
// matching extension in webpack's resolve.extensions and fails with "Module not found".
// Keep this object's keys in sync with tsconfig.json's "paths".
const pathAliases = {
  '@components': path.resolve(__dirname, 'lib/components'),
  '@hooks': path.resolve(__dirname, 'lib/hooks'),
  '@models': path.resolve(__dirname, 'lib/models'),
  '@services': path.resolve(__dirname, 'lib/services'),
  '@styles': path.resolve(__dirname, 'lib/styles'),
  '@theme': path.resolve(__dirname, 'lib/theme'),
  '@assets': path.resolve(__dirname, 'lib/assets'),
  '@utils': path.resolve(__dirname, 'lib/utils'),
  '@layouts': path.resolve(__dirname, 'lib/layouts'),
  '@app-types': path.resolve(__dirname, 'lib/types'),
  '@config': path.resolve(__dirname, 'lib/config')
};

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.resolve = generatedConfiguration.resolve || {};
    generatedConfiguration.resolve.alias = {
      ...generatedConfiguration.resolve.alias,
      ...pathAliases
    };

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));
