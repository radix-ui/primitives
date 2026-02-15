import * as React from 'react';
import { Toolbar } from 'radix-ui';

export function Basic() {
  return (
    <Toolbar.Root orientation="vertical">
      <Toolbar.Button>Button</Toolbar.Button>
      <Toolbar.Separator>***</Toolbar.Separator>
      <Toolbar.Link href="#">Link</Toolbar.Link>
    </Toolbar.Root>
  );
}
