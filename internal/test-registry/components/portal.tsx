'use client';
import * as React from 'react';
import { Portal } from 'radix-ui';

export function Basic() {
  return (
    <div
      style={{
        maxWidth: 300,
        maxHeight: 200,
        overflow: 'auto',
        border: '1px solid',
      }}
    >
      <h1>This content is rendered in the main DOM tree</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos porro, est ex quia itaque
        facere fugit necessitatibus aut enim. Nisi rerum quae, repellat in perspiciatis explicabo
        laboriosam necessitatibus eius pariatur.
      </p>

      <Portal.Root>
        <h1>This content is rendered in a portal (another DOM tree)</h1>
        <p>
          Because of the portal, it can appear in a different DOM tree from the main one (by default
          a new element inside the body), even though it is part of the same React tree.
        </p>
      </Portal.Root>
    </div>
  );
}

export function Custom() {
  const [container, setContainer] = React.useState<Element | null>(null);
  return (
    <div>
      <em ref={setContainer} />
      <Portal.Root container={container}>
        <span>This content is rendered in a custom container</span>
      </Portal.Root>
    </div>
  );
}

export function Conditional() {
  const [container, setContainer] = React.useState<Element | null>(null);
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        Toggle another portal
      </button>
      <b ref={setContainer} />
      {open && (
        <Portal.Root container={container}>
          <span>This content is rendered in a custom container</span>
        </Portal.Root>
      )}
    </div>
  );
}
