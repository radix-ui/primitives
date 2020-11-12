import * as React from 'react';
import { AccessibleIcon as AccessibleIconPrimitive, styles } from './AccessibleIcon';

export default { title: 'Components/AccessibleIcon' };

export const Basic = () => <AccessibleIcon label="Close" />;
export const InlineStyle = () => <AccessibleIcon label="Close" style={{ color: 'gainsboro' }} />;

const AccessibleIcon = (props: React.ComponentProps<typeof AccessibleIconPrimitive>) => (
  <AccessibleIconPrimitive {...props} style={{ ...styles.root, ...props.style }}>
    <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </AccessibleIconPrimitive>
);
