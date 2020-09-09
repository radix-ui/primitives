import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive, styles } from './AspectRatio';

export default { title: 'AspectRatio' };

export const Basic = () => (
  <AspectRatio>
    <img src="https://picsum.photos/id/10/400/600" alt="" style={{ width: '100%' }} />
  </AspectRatio>
);

export const CustomRatio = () => (
  <AspectRatio ratio={2 / 1}>
    <img src="https://picsum.photos/id/10/400/600" alt="" style={{ width: '100%' }} />
  </AspectRatio>
);

export const InlineStyle = () => (
  <AspectRatio ratio={2 / 1} style={{ width: 500, backgroundColor: 'gainsboro' }} />
);

const AspectRatio = (props: React.ComponentProps<typeof AspectRatioPrimitive>) => (
  <AspectRatioPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
