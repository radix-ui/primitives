import * as React from 'react';
import { Card as CardPrimitive, styles } from './Card';

export default { title: 'Card' };

const Card = (props: React.ComponentProps<typeof CardPrimitive>) => (
  <CardPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

export const Basic = () => <Card>Card</Card>;

export const InlineStyle = () => (
  <Card style={{ border: '2px solid gainsboro', padding: '20px', borderRadius: '4px' }}>Card</Card>
);
