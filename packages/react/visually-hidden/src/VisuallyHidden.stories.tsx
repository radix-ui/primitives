import * as React from 'react';
import { VisuallyHidden as VisuallyHiddenPrimitive, styles } from './VisuallyHidden';

export default { title: 'Components/VisuallyHidden' };

export const Basic = () => (
  <button>
    <VisuallyHidden>Save the file</VisuallyHidden>
    <span aria-hidden>💾</span>
  </button>
);

const VisuallyHidden = (props: React.ComponentProps<typeof VisuallyHiddenPrimitive>) => (
  <VisuallyHiddenPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
