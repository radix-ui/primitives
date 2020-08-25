import * as React from 'react';
import { Blockquote as BlockquotePrimitive, styles } from './Blockquote';

export default { title: 'Blockquote' };

export const Basic = () => <Blockquote>Blockquote</Blockquote>;
export const InlineStyle = () => (
  <Blockquote style={{ borderLeft: '2px solid gainsboro', paddingLeft: 10 }}>Blockquote</Blockquote>
);

const Blockquote = (props: React.ComponentProps<typeof BlockquotePrimitive>) => (
  <BlockquotePrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
