import * as React from 'react';
import { Divider as DividerPrimitive, styles } from './Divider';

export default { title: 'Divider' };

export const Basic = () => <Divider />;
export const InlineStyle = () => <Divider style={{ height: 2, backgroundColor: 'gainsboro' }} />;

const Divider = (props: React.ComponentProps<typeof DividerPrimitive>) => (
  <DividerPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
