import * as React from 'react';
import { AccessibleIcon, useHasAccessibleIconContext } from './AccessibleIcon';

export default { title: 'AccessibleIcon' };

export function Basic() {
  console.log(useHasAccessibleIconContext()); // should be `false`
  return (
    <AccessibleIcon label="Close">
      <SVG />
    </AccessibleIcon>
  );
}

function SVG() {
  console.log(useHasAccessibleIconContext()); // should be `true`
  return (
    <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  );
}
