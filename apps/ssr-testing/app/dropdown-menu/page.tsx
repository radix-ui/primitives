import * as React from 'react';
import { DropdownMenu } from 'radix-ui';

export default function Page() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.Item>Undo</DropdownMenu.Item>
          <DropdownMenu.Item>Redo</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item disabled>Cut</DropdownMenu.Item>
          <DropdownMenu.Item>Copy</DropdownMenu.Item>
          <DropdownMenu.Item>Paste</DropdownMenu.Item>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
