import { createConfigItem, TransformOptions } from '@babel/core';

const babelConfig: TransformOptions = {
  exclude: ['node_modules/**'],
  presets: createConfigItems('preset', [
    {
      name: '@babel/preset-env',
      modules: false,
      loose: true,
    },
  ]),
  plugins: createConfigItems('plugin', [
    { name: 'babel-plugin-annotate-pure-calls' },
    { name: 'babel-plugin-dev-expression' },
    {
      name: '@babel/plugin-proposal-class-properties',
      loose: true,
    },

    // Because optional chaining and nullish coalescing are TypeScript features, we can We set our
    // tsconfig target to 2017 and skip these transforms in the Babel process. This makes a pretty
    // dramatic impact on build times.

    // { name: '@babel/plugin-proposal-optional-chaining' },
    // { name: '@babel/plugin-proposal-nullish-coalescing-operator' },
  ]),
};

export default babelConfig;

function createConfigItems(type: 'plugin' | 'preset', items: Record<string, any>[]) {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name!), options], { type });
  });
}
