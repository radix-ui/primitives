import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

// TODO: figure out why glob causes dev server to hang
const packageMap = {
  // core packages
  '@radix-ui/number': 'core/number',
  '@radix-ui/primitive': 'core/primitive',
  '@radix-ui/rect': 'core/rect',

  // react packages
  'radix-ui': 'react/radix-ui',
  '@radix-ui/react-accessible-icon': 'react/accessible-icon',
  '@radix-ui/react-accordion': 'react/accordion',
  '@radix-ui/react-alert-dialog': 'react/alert-dialog',
  '@radix-ui/react-announce': 'react/announce',
  '@radix-ui/react-arrow': 'react/arrow',
  '@radix-ui/react-aspect-ratio': 'react/aspect-ratio',
  '@radix-ui/react-avatar': 'react/avatar',
  '@radix-ui/react-checkbox': 'react/checkbox',
  '@radix-ui/react-collapsible': 'react/collapsible',
  '@radix-ui/react-collection': 'react/collection',
  '@radix-ui/react-compose-refs': 'react/compose-refs',
  '@radix-ui/react-context': 'react/context',
  '@radix-ui/react-context-menu': 'react/context-menu',
  '@radix-ui/react-dialog': 'react/dialog',
  '@radix-ui/react-direction': 'react/direction',
  '@radix-ui/react-dismissable-layer': 'react/dismissable-layer',
  '@radix-ui/react-dropdown-menu': 'react/dropdown-menu',
  '@radix-ui/react-focus-guards': 'react/focus-guards',
  '@radix-ui/react-focus-scope': 'react/focus-scope',
  '@radix-ui/react-form': 'react/form',
  '@radix-ui/react-hover-card': 'react/hover-card',
  '@radix-ui/react-id': 'react/id',
  '@radix-ui/react-label': 'react/label',
  '@radix-ui/react-menu': 'react/menu',
  '@radix-ui/react-menubar': 'react/menubar',
  '@radix-ui/react-navigation-menu': 'react/navigation-menu',
  '@radix-ui/react-popover': 'react/popover',
  '@radix-ui/react-popper': 'react/popper',
  '@radix-ui/react-portal': 'react/portal',
  '@radix-ui/react-presence': 'react/presence',
  '@radix-ui/react-primitive': 'react/primitive',
  '@radix-ui/react-progress': 'react/progress',
  '@radix-ui/react-radio-group': 'react/radio-group',
  '@radix-ui/react-roving-focus': 'react/roving-focus',
  '@radix-ui/react-scroll-area': 'react/scroll-area',
  '@radix-ui/react-select': 'react/select',
  '@radix-ui/react-separator': 'react/separator',
  '@radix-ui/react-slider': 'react/slider',
  '@radix-ui/react-slot': 'react/slot',
  '@radix-ui/react-switch': 'react/switch',
  '@radix-ui/react-tabs': 'react/tabs',
  '@radix-ui/react-toast': 'react/toast',
  '@radix-ui/react-toggle': 'react/toggle',
  '@radix-ui/react-toggle-group': 'react/toggle-group',
  '@radix-ui/react-toolbar': 'react/toolbar',
  '@radix-ui/react-tooltip': 'react/tooltip',
  '@radix-ui/react-use-callback-ref': 'react/use-callback-ref',
  '@radix-ui/react-use-controllable-state': 'react/use-controllable-state',
  '@radix-ui/react-use-escape-keydown': 'react/use-escape-keydown',
  '@radix-ui/react-use-layout-effect': 'react/use-layout-effect',
  '@radix-ui/react-use-previous': 'react/use-previous',
  '@radix-ui/react-use-rect': 'react/use-rect',
  '@radix-ui/react-use-size': 'react/use-size',
  '@radix-ui/react-visually-hidden': 'react/visually-hidden',
};

const config: StorybookConfig = {
  stories: Object.values(packageMap).map(
    (packagePath) => `../packages/${packagePath}/src/*.stories.tsx`
  ),

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
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

  // we need to add aliases to webpack so it knows how to follow
  // to the source of the packages rather than the built version (dist)
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // ...convertRadixPackagesToWebpackAliases(),
      },
    },
  }),
};

export default config;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return path.dirname(require.resolve(path.join(value, 'package.json')));
}
