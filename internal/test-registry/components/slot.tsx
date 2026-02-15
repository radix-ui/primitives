import * as React from 'react';
import { Slot } from 'radix-ui';

export function Basic() {
  return (
    <Slot.Root>
      <span>I&apos;m in a </span>
      <Slot.Slottable>
        <em>Slot!?</em>
      </Slot.Slottable>
    </Slot.Root>
  );
}
