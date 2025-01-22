import * as React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

export default function Page() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>Hover me</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content>
          <HoverCard.Arrow width={20} height={10} />
          Nicely done!
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
