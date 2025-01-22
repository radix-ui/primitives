'use client';

import * as React from 'react';
import { Portal } from '@radix-ui/react-portal';

export const ConditionalPortal = () => {
  const [container, setContainer] = React.useState<Element | null>(null);
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen((prev) => !prev)}>Toggle another portal</button>
      <b ref={setContainer} />
      {open && (
        <Portal container={container}>
          <span>This content is rendered in a custom container</span>
        </Portal>
      )}
    </div>
  );
};
