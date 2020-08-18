import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive, styles } from './AspectRatio';

export default { title: 'AspectRatio' };

export const Basic = () => (
  <AspectRatio>
    <img src="https://picsum.photos/id/10/400/600" alt="" style={{ width: '100%' }} />
  </AspectRatio>
);

export const CustomRatio = () => (
  <AspectRatio ratio="4:2">
    <img src="https://picsum.photos/id/10/400/600" alt="" style={{ width: '100%' }} />
  </AspectRatio>
);

export const InlineStyle = () => (
  <AspectRatio ratio="4:2" style={{ width: 500, backgroundColor: 'gainsboro' }} />
);

const AspectRatio = ({ children, ...props }: React.ComponentProps<typeof AspectRatioPrimitive>) => (
  <AspectRatioPrimitive.Root {...props} style={{ ...styles.root, ...props.style }}>
    <AspectRatioPrimitive.Inner style={styles.inner}>{children}</AspectRatioPrimitive.Inner>
  </AspectRatioPrimitive.Root>
);
