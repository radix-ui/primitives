import * as React from 'react';
import { Collapsible } from './Collapsible';

export default { title: 'Collapsible' };

export const Basic = () => (
  <Collapsible className="test">
    <Collapsible.Button className="button">Button</Collapsible.Button>
    <Collapsible.Content className="content">Content 1</Collapsible.Content>
  </Collapsible>
);
