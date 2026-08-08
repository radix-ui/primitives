import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    //
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  features: {
    experimentalRSC: true,
  },
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {},
      // enable React strict mode
      strictMode: true,
    },
  },

  webpackFinal: async (config) => {
    config.resolve ??= {};
    // Resolve TypeScript's ESM-style `.js` import specifiers (e.g. `./remove-scroll.js`) to their
    // `.ts`/`.tsx` sources. This lets packages authored for native `tsc` ESM emit (which requires
    // explicit `.js` extensions on relative imports) be consumed from source by webpack. Real `.js`
    // files still resolve via the trailing fallback.
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },

  swc: (config: any) => ({
    ...config,
    jsc: {
      ...config?.jsc,
      transform: {
        ...config?.jsc?.transform,
        react: {
          // Do not require importing React into scope to use JSX
          runtime: 'automatic',
        },
      },
    },
  }),
};
export default config;
