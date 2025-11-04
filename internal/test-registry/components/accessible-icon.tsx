import * as React from 'react';
import { AccessibleIcon } from 'radix-ui';

export function Basic() {
  return (
    <button type="button">
      <AccessibleIcon.Root label="Close">
        <span>X</span>
      </AccessibleIcon.Root>
    </button>
  );
}
