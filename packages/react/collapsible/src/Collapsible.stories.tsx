import * as React from 'react';
import { Collapsible as CollapsiblePrimitive, styles } from './Collapsible';

export default { title: 'Components/Collapsible' };

export const Basic = () => (
  <Collapsible>
    <CollapsibleButton>Button</CollapsibleButton>
    <CollapsibleContent>Content 1</CollapsibleContent>
  </Collapsible>
);

export const InlineStyle = () => (
  <Collapsible style={{ background: 'ghostwhite', border: '1px solid gainsboro' }}>
    <CollapsibleButton style={{ background: 'gainsboro' }}>Button</CollapsibleButton>
    <CollapsibleContent>Content 1</CollapsibleContent>
  </Collapsible>
);

const Collapsible = (props: React.ComponentProps<typeof CollapsiblePrimitive>) => (
  <CollapsiblePrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const CollapsibleButton = (props: React.ComponentProps<typeof CollapsiblePrimitive.Button>) => (
  <CollapsiblePrimitive.Button {...props} style={{ ...styles.button, ...props.style }} />
);

const CollapsibleContent = (props: React.ComponentProps<typeof CollapsiblePrimitive.Content>) => (
  <CollapsiblePrimitive.Content {...props} style={{ ...styles.content, ...props.style }} />
);
