import * as React from 'react';
import { Menubar } from 'radix-ui';

export default function Page() {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>Open</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Label>Menu</Menubar.Label>
            <Menubar.Item>Item 1</Menubar.Item>
            <Menubar.Item>Item 2</Menubar.Item>
            <Menubar.Item>Item 3</Menubar.Item>
            <Menubar.Arrow />
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
