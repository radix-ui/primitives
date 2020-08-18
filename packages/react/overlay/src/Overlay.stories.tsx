import * as React from 'react';
import { Overlay as OverlayPrimitive, styles } from './Overlay';

export default { title: 'Overlay' };

export const Basic = () => <Overlay>Overlay</Overlay>;

export const InlineStyle = () => (
  <Overlay style={{ backgroundColor: 'gainsboro' }}>Overlay</Overlay>
);

const Overlay = (props: React.ComponentProps<typeof OverlayPrimitive>) => (
  <OverlayPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
