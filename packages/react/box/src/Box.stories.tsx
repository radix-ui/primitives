import * as React from 'react';
import { Box as BoxPrimitive, styles } from './Box';

export default { title: 'Box' };

export const Basic = () => <Box>Box</Box>;
export const InlineStyle = () => <Box style={{ backgroundColor: 'gainsboro' }}>Box</Box>;

const Box = (props: React.ComponentProps<typeof BoxPrimitive>) => (
  <BoxPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
