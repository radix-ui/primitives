import * as React from 'react';
import { Checkbox } from 'radix-ui';

export function Basic() {
  return (
    <Checkbox.Root>
      [ <Checkbox.Indicator>✔</Checkbox.Indicator> ]
    </Checkbox.Root>
  );
}
