import * as React from 'react';
import { Input as InputPrimitive, styles } from './Input';

export default { title: 'Input' };

export const Basic = () => <Input defaultValue="Hello" />;

export const InlineStyle = () => (
  <Input style={{ border: '1px solid gainsboro', padding: '5px' }} />
);

const Input = (props: React.ComponentProps<typeof InputPrimitive>) => (
  <InputPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
