import * as React from 'react';
import { Portal } from './Portal';

export default { title: 'Components/Portal' };

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

    <Portal>
      <h1>This content is rendered in a portal (another DOM tree)</h1>
      <p>
        Because of the portal, it can appear in a different DOM tree from the main one (by default a
        new element inside the body), even though it is part of the same React tree.
      </p>
    </Portal>
  </div>
);

export const CustomContainer = () => {
  const portalContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div style={{ maxWidth: 300, padding: 10, margin: 10, border: '1px solid' }}>
        <h1>Container A</h1>
        <Portal containerRef={portalContainerRef}>
          <p>
            This content is rendered in a portal inside Container A but appears inside Container B
            because we have used Container B as a container element for the Portal.
          </p>
        </Portal>
      </div>

      <div
        ref={portalContainerRef}
        style={{ maxWidth: 300, padding: 10, margin: 10, border: '1px solid' }}
      >
        <h1>Container B</h1>
      </div>
    </>
  );
};
