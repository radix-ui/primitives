import * as React from 'react';
import { Avatar as AvatarPrimitive, styles } from './Avatar';

export default { title: 'Components/Avatar' };

export const WithImage = () => <Avatar src="https://picsum.photos/id/1005/400/400" />;
export const WithoutImage = () => <Avatar />;
export const BrokenLink = () => <Avatar src="https://broken.link.com/broken-pic.jpg" />;

export const InlineStyle = () => (
  <Avatar
    src="https://picsum.photos/id/1005/400/400"
    style={{
      backgroundColor: 'gainsboro',
      borderRadius: 50,
      width: 50,
      height: 50,
    }}
  />
);

export const InlineStyleBroken = () => (
  <Avatar
    src="https://broken.link.com/broken-pic.jpg"
    style={{
      backgroundColor: 'gainsboro',
      borderRadius: 50,
      width: 50,
      height: 50,
    }}
  />
);

const Avatar = ({
  src,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive> & { src?: string }) => (
  <AvatarPrimitive {...props} style={{ ...styles.root, ...props.style }}>
    <AvatarPrimitive.Image
      alt="John Smith"
      src={src}
      style={styles.image}
      onLoadingStatusChange={console.log}
    />
    <AvatarPrimitive.Fallback>JS</AvatarPrimitive.Fallback>
  </AvatarPrimitive>
);
