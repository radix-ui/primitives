import * as React from 'react';
import { Checkbox } from 'radix-ui';

export default function Page() {
  return (
    <Checkbox.Root>
      [ <Checkbox.Indicator>✔</Checkbox.Indicator> ]
    </Checkbox.Root>
  );
}
