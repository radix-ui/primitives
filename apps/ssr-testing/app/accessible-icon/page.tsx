import * as React from 'react';
import { AccessibleIcon } from 'radix-ui';

export default function Page() {
  return (
    <button type="button">
      <AccessibleIcon.Root label="Close">
        <span>X</span>
      </AccessibleIcon.Root>
    </button>
  );
}
