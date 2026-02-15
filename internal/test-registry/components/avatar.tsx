import * as React from 'react';
import { Avatar } from 'radix-ui';

export function Basic() {
  return (
    <Avatar.Root>
      <Avatar.Fallback>A</Avatar.Fallback>
      <Avatar.AvatarImage src="https://picsum.photos/id/1005/400/400" />
    </Avatar.Root>
  );
}
