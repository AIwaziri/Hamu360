'use strict';

const build = require('@microsoft/sp-build-web');
const path = require('path');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

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
// Keep this object's keys in sync with tsconfig.json's "paths".
const pathAliases = {
  '@components': path.resolve(__dirname, 'src/components'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@models': path.resolve(__dirname, 'src/models'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@styles': path.resolve(__dirname, 'src/styles'),
  '@theme': path.resolve(__dirname, 'src/theme'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@layouts': path.resolve(__dirname, 'src/layouts'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@config': path.resolve(__dirname, 'src/config')
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
