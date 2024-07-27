import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Components', 'Utilities'],
      },
    },

    // disables Chromatic on a global level
    chromatic: { disable: true },
  },
};

export default preview;
