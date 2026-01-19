import * as React from 'react';
import { Slot } from 'radix-ui';

export default function Page() {
  return (
    <Slot.Root>
      <span>I'm in a </span>
      <Slot.Slottable>
        <em>Slot!?</em>
      </Slot.Slottable>
    </Slot.Root>
  );
}
