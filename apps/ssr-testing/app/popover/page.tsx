import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';

export default function Page() {
  return (
    <Popover.Root>
      <Popover.Trigger>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={5}>
          <Popover.Close>close</Popover.Close>
          <Popover.Arrow width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
