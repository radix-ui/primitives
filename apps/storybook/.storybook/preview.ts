import type { Preview } from '@storybook/react-vite';
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
