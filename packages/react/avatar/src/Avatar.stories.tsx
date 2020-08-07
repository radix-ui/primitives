import * as React from 'react';
import { Avatar, styles as avatarStyles } from './Avatar';

export default { title: 'Avatar' };

export function Basic() {
  return (
    <div>
      <Avatar.Root alt="John Smith" src="https://picsum.photos/400/400" style={avatarStyles.root}>
        <Avatar.Image style={avatarStyles.image} />
        <Avatar.Abbr style={avatarStyles.abbr} />
      </Avatar.Root>
    </div>
  );
}

export function BrokenLink() {
  return (
    <div>
      <Avatar.Root
        alt="John Smith"
        src="https://broken.link.com/broken-pic.jpg"
        style={avatarStyles.root}
        renderLoading={() => <span style={{ color: 'red' }}>Loading lalalala</span>}
      >
        <Avatar.Image style={avatarStyles.image} />
        <Avatar.Abbr style={avatarStyles.abbr} />
      </Avatar.Root>
    </div>
  );
}
