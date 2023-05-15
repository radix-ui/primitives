import * as React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default { title: 'Utilities/VisuallyHidden' };

export const Basic = () => (
  <button>
    <VisuallyHidden>Save the file</VisuallyHidden>
    <span aria-hidden>💾</span>
  </button>
);
