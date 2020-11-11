import * as React from 'react';
import { Arrow as ArrowPrimitive, styles } from './Arrow';

export default { title: 'Components/Arrow' };

export const Basic = () => <Arrow />;
export const InlineStyle = () => <Arrow width={20} height={10} style={{ fill: 'gainsboro' }} />;

const Arrow = ({ children, ...props }: React.ComponentProps<typeof ArrowPrimitive>) => (
  <ArrowPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
