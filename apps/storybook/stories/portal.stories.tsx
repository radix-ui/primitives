import * as React from 'react';
import { Portal } from 'radix-ui';

export default { title: 'Utilities/Portal' };

export const Base = () => (
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
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos porro, est ex quia itaque facere
      fugit necessitatibus aut enim. Nisi rerum quae, repellat in perspiciatis explicabo laboriosam
      necessitatibus eius pariatur.
    </p>

    <Portal.Root>
      <h1>This content is rendered in a portal (another DOM tree)</h1>
      <p>
        Because of the portal, it can appear in a different DOM tree from the main one (by default a
        new element inside the body), even though it is part of the same React tree.
      </p>
    </Portal.Root>
  </div>
);

export const CustomContainer = () => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <>
      <div style={{ maxWidth: 300, padding: 10, margin: 10, border: '1px solid' }}>
        <h1>Container A</h1>
        <Portal.Root asChild container={portalContainer}>
          <p>
            This content is rendered in a portal inside Container A but appears inside Container B
            because we have used Container B as a container element for the Portal.
          </p>
        </Portal.Root>
      </div>

      <div
        ref={setPortalContainer}
        style={{ maxWidth: 300, padding: 10, margin: 10, border: '1px solid' }}
      >
        <h1>Container B</h1>
      </div>
    </>
  );
};

export const Chromatic = () => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <div style={{ padding: 150 }}>
      <h1>Default (append to body)</h1>
      <div style={{ padding: 10, margin: 10, border: '1px solid blue' }}>
        <p>Container A</p>

        <Portal.Root asChild>
          <div
            style={{
              padding: 10,
              margin: 10,
              border: '1px solid blue',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 9999999,
            }}
          >
            <p>This content is rendered in a portal (another DOM tree)</p>
            <p>
              Because of the portal, it can appear in a different DOM tree from the main one (by
              default a new element inside the body), even though it is part of the same React tree.
            </p>
          </div>
        </Portal.Root>
      </div>

      <h1>Custom container</h1>
      <div style={{ padding: 10, margin: 10, border: '1px solid green' }}>
        <p>Container B</p>
        <Portal.Root asChild container={portalContainer}>
          <div style={{ padding: 10, margin: 10, border: '1px solid green' }}>
            <p>
              This content is rendered in a portal inside Container B but appears inside Container C
              because we have used Container C as a container element for the Portal.
            </p>
          </div>
        </Portal.Root>
      </div>

      <div ref={setPortalContainer} style={{ padding: 10, margin: 10, border: '1px solid' }}>
        <p>Container C</p>
      </div>

      <h1>zIndex and order</h1>
      <p>See squares in the top-left</p>
      <Portal.Root asChild>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'red',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999999,
          }}
        />
      </Portal.Root>
      <Portal.Root asChild>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'green',
            marginLeft: 10,
            marginTop: 10,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999999,
          }}
        />
      </Portal.Root>
      <Portal.Root asChild>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'blue',
            marginLeft: 20,
            marginTop: 20,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999999,
          }}
        />
      </Portal.Root>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };
