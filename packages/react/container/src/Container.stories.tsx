import * as React from 'react';
import { Container as ContainerPrimitive, styles } from './Container';

export default { title: 'Container' };

export const Basic = () => <Container>Container</Container>;

export const InlineStyle = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Container style={{ backgroundColor: 'gainsboro' }}>Container</Container>
  </div>
);

const Container = (props: React.ComponentProps<typeof ContainerPrimitive>) => (
  <ContainerPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
