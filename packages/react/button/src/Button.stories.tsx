import * as React from 'react';
import { Button as ButtonPrimitive, styles } from './Button';

export default { title: 'Button' };

export const Basic = () => <Button>Button</Button>;

export const InlineStyle = () => (
  <Button style={{ backgroundColor: 'gainsboro', padding: '5px 10px', borderRadius: '4px' }}>
    Button
  </Button>
);

const Button = (props: React.ComponentProps<typeof ButtonPrimitive>) => (
  <ButtonPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
