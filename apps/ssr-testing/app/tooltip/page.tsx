import * as React from 'react';
import { Tooltip } from 'radix-ui';

export default function Page() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover or Focus me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            side="left"
            align="center"
            avoidCollisions={true}
            collisionBoundary={document.body}
            collisionPadding={10}
            sticky="partial"
          >
            Nicely done!
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
