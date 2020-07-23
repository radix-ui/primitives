import * as React from 'react';
import { AccessibleIcon } from './AccessibleIcon';

export default { title: 'AccessibleIcon' };

export const Basic = () => (
  <AccessibleIcon label="Close">
    <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </AccessibleIcon>
);
