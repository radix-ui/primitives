import { createConfigItem, ConfigItem, TransformOptions } from '@babel/core';

type Opts = Omit<TransformOptions, 'presets' | 'plugins'> & {
  cacheConfigItems?: boolean;
  presets?: ConfigItem[];
  plugins?: ConfigItem[];
  targets?: any;
};

let plugins = createConfigItems('plugin', [
  { name: 'babel-plugin-annotate-pure-calls' },
  { name: 'babel-plugin-dev-expression' },
  {
    name: '@babel/plugin-proposal-class-properties',
    loose: true,
  },
  { name: '@babel/plugin-proposal-optional-chaining' },
  { name: '@babel/plugin-proposal-nullish-coalescing-operator' },
  { name: 'babel-plugin-macros' },
]);

let presets = createConfigItems('preset', [
  {
    name: '@babel/preset-env',
    modules: false,
    loose: true,
    exclude: ['transform-async-to-generator', 'transform-regenerator'],
  },
]);

const config: TransformOptions = {
  exclude: ['node_modules/**'],
  presets,
  plugins,
};

export default config;

function createConfigItems(type: 'plugin' | 'preset', items: Record<string, any>[]) {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name!), options], { type });
  });
}
