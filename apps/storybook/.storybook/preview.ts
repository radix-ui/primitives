import type { Preview } from '@storybook/react-webpack5';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Components', 'Utilities'],
      },
    },
    // disables Chromatic on a global level
    chromatic: { disable: true },
    docs: {
      codePanel: true,
    },
  },
};

export default preview;
