import * as React from 'react';
import { Collapsible } from 'radix-ui';

export default function Page() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Trigger</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  );
}
