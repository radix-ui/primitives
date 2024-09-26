import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    // This should work after upgrading to Storybook 7.6 but doesn't.
    // I am leaving it commented out here so we can fix it one day.
    //
    // options: {
    //   storySort: {
    //     order: ['Components', 'Utilities'],
    //   },
    // },

    // disables Chromatic on a global level
    chromatic: { disable: true },
  },
};

export default preview;
