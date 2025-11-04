import * as React from 'react';
import { Collapsible } from 'radix-ui';

export function Basic() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Trigger</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  );
}
