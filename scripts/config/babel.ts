import { createConfigItem, ConfigItem, TransformOptions } from '@babel/core';
import { merge } from 'lodash';

type Opts = Omit<TransformOptions, 'presets' | 'plugins'> & {
  cacheConfigItems?: boolean;
  presets?: ConfigItem[];
  plugins?: ConfigItem[];
  targets?: any;
};

export function getBabelConfig(options: Opts = {}): TransformOptions {
  const {
    cacheConfigItems = false,
    presets: presetOverrides = [],
    plugins: pluginOverrides = [],
    targets = undefined,
    exclude = [],
    ...rest
  } = options;

  let defaultPlugins = createConfigItems('plugin', [
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

  let defaultPresets = createConfigItems('preset', [
    {
      name: '@babel/preset-env',
      targets,
      modules: false,
      loose: true,
      exclude: ['transform-async-to-generator', 'transform-regenerator'],
    },
  ]);

  let presets = [
    ...presetOverrides,
    {
      name: '@babel/preset-env',
      targets,
      modules: false,
      loose: true,
      exclude: ['transform-async-to-generator', 'transform-regenerator'],
    },
  ];

  let plugins = [
    ...pluginOverrides,
    { name: 'babel-plugin-annotate-pure-calls' },
    { name: 'babel-plugin-dev-expression' },
    {
      name: '@babel/plugin-proposal-class-properties',
      loose: true,
    },
    { name: '@babel/plugin-proposal-optional-chaining' },
    { name: '@babel/plugin-proposal-nullish-coalescing-operator' },
    { name: 'babel-plugin-macros' },
  ];

  if (cacheConfigItems) {
    presets = mergeConfigItems('preset', ...defaultPresets, ...presetOverrides);
    plugins = mergeConfigItems('plugin', ...defaultPlugins, ...pluginOverrides);
  }

  return {
    ...rest,
    exclude: [...(Array.isArray(exclude) ? exclude : [exclude]), 'node_modules/**'],
    presets,
    plugins,
  };
}

export default getBabelConfig();

function createConfigItems(type: 'plugin' | 'preset', items: Record<string, any>[]) {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name!), options], { type });
  });
}

function mergeConfigItems(type: 'plugin' | 'preset', ...configItemsToMerge: ConfigItem[]) {
  const mergedItems: ConfigItem[] = [];

  configItemsToMerge.forEach((item) => {
    const itemToMergeWithIndex = mergedItems.findIndex(
      (mergedItem) => mergedItem.file?.resolved === item.file?.resolved
    );

    if (itemToMergeWithIndex === -1) {
      mergedItems.push(item);
      return;
    }

    mergedItems[itemToMergeWithIndex] = createConfigItem(
      [
        mergedItems[itemToMergeWithIndex].file?.resolved,
        merge(mergedItems[itemToMergeWithIndex].options, item.options),
      ],
      {
        type,
      }
    );
  });

  return mergedItems;
}
