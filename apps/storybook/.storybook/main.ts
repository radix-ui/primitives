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
