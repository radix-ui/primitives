import * as React from 'react';
import { Avatar as AvatarPrimitive, styles } from './Avatar';

export default { title: 'Avatar' };

export const WithImage = () => (
  <Avatar src="https://picsum.photos/id/1005/400/400" alt="John Smith" />
);

export const WithoutImage = () => <Avatar alt="Someone else" />;

export const BrokenLink = () => (
  <Avatar src="https://broken.link.com/broken-pic.jpg" alt="John Smith" />
);

export const InlineStyle = () => (
  <Avatar
    src="https://picsum.photos/id/1005/400/400"
    alt="John Smith"
    style={{
      backgroundColor: 'gainsboro',
      borderRadius: 50,
      width: 50,
      height: 50,
    }}
  />
);

const Avatar = (props: React.ComponentProps<typeof AvatarPrimitive>) => (
  <AvatarPrimitive.Root
    {...props}
    renderLoading={() => <span style={{ color: 'red', fontSize: 11 }}>Loading</span>}
    style={{ ...styles.root, ...props.style }}
  >
    <AvatarPrimitive.Image style={styles.image} />
    <AvatarPrimitive.Abbr style={styles.abbr} />
    <AvatarPrimitive.Icon />
  </AvatarPrimitive.Root>
);
