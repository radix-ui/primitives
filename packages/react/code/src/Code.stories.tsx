import * as React from 'react';
import { Code as CodePrimitive, styles } from './Code';

export default { title: 'Code' };

export const Basic = () => <Code>Code</Code>;

export const InlineStyle = () => (
  <Code
    style={{
      backgroundColor: 'ghostwhite',
      border: '1px solid gainsboro',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'Courier',
      fontSize: '12px',
    }}
  >
    Code
  </Code>
);

const Code = (props: React.ComponentProps<typeof CodePrimitive>) => (
  <CodePrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
