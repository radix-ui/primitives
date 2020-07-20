import * as React from 'react';
import { Collapsible } from './Collapsible';

export default { title: 'Collapsible' };

export const Basic = () => (
  <Collapsible>
    <Collapsible.Button>Button</Collapsible.Button>
    <Collapsible.Content>Content 1</Collapsible.Content>
  </Collapsible>
);
