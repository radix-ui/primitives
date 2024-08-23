import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

export default function Page() {
  return (
    <Avatar.Root>
      <Avatar.Fallback>A</Avatar.Fallback>
      <Avatar.AvatarImage src="https://picsum.photos/id/1005/400/400" />
    </Avatar.Root>
  );
}
