import * as React from 'react';
import { Image as ImagePrimitive, styles } from './Image';

export default { title: 'Image' };

export const Basic = () => <Image src="https://picsum.photos/id/1005/400/400" />;

const Image = (props: React.ComponentProps<typeof ImagePrimitive>) => (
  <ImagePrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
