import * as React from 'react';
import { ContextMenu } from 'radix-ui';

export function Basic() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content alignOffset={-5}>
          <ContextMenu.Item>Undo</ContextMenu.Item>
          <ContextMenu.Item>Redo</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item disabled>Cut</ContextMenu.Item>
          <ContextMenu.Item>Copy</ContextMenu.Item>
          <ContextMenu.Item>Paste</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
