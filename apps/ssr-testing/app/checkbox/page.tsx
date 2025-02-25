import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';

export default function Page() {
  return (
    <Checkbox.Root>
      [ <Checkbox.Indicator>✔</Checkbox.Indicator> ]
    </Checkbox.Root>
  );
}
