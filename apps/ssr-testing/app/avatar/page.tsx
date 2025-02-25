import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

export default function Page() {
  return (
    <Avatar.Root>
      <Avatar.Fallback>A</Avatar.Fallback>
    </Avatar.Root>
  );
}
