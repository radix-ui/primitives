const path = require('path');
const { merge } = require('lodash');

module.exports = {
  stories: ['../packages/**/*.stories.tsx'],
  addons: ['@storybook/preset-typescript'],

  // we need to add aliases to webpack so it knows how to follow
  // to the source of the packages rather than the built version (dist)
  webpackFinal: async (config) =>
    merge(config, {
      resolve: {
        alias: convertTsConfigPathsToWebpackAliases(),
      },
    }),
};

function convertTsConfigPathsToWebpackAliases() {
  const rootDir = path.resolve(__dirname, '../');
  const tsconfig = require('../tsconfig.json');
  const tsconfigPaths = Object.entries(tsconfig.compilerOptions.paths);

  return tsconfigPaths.reduce((aliases, [realPath, mappedPath]) => {
    aliases[realPath] = path.join(rootDir, mappedPath[0]);
    return aliases;
  }, {});
}
