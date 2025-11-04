import * as React from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { AccessibleIcon } from 'radix-ui';

export function Basic() {
  return (
    <button type="button">
      <AccessibleIcon.Root label="Close">
        <Cross1Icon />
      </AccessibleIcon.Root>
    </button>
  );
}
