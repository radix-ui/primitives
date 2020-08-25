import * as React from 'react';
import { Header as HeaderPrimitive, styles } from './Header';

export default { title: 'Header' };

export const Basic = () => <Header>Header</Header>;

export const Sticky = () => (
  <div style={{ height: 9000 }}>
    <Header isSticky>Header</Header>
  </div>
);

export const InlineStyle = () => <Header style={{ backgroundColor: 'gainsboro' }}>Header</Header>;

const Header = (props: React.ComponentProps<typeof HeaderPrimitive>) => (
  <HeaderPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
