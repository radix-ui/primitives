import * as React from 'react';
import { AccessibleIcon } from './AccessibleIcon';

export default { title: 'Components/AccessibleIcon' };

export const Styled = () => (
  <button type="button">
    <AccessibleIcon label="Close">
      <CrossIcon />
    </AccessibleIcon>
  </button>
);

const CrossIcon = () => (
  <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
    <path d="M2 30 L30 2 M30 30 L2 2" />
  </svg>
);
