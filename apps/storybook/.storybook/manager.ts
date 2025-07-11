import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  enableShortcuts: false,
  theme: themes.light,
});
