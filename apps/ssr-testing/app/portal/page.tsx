import * as React from 'react';
import { Portal } from '@radix-ui/react-portal';
import { CustomPortalContainer } from './custom-portal-container';
import { ConditionalPortal } from './conditional-portal';

export default function Page() {
  return (
    <div>
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

        <Portal>
          <h1>This content is rendered in a portal (another DOM tree)</h1>
          <p>
            Because of the portal, it can appear in a different DOM tree from the main one (by
            default a new element inside the body), even though it is part of the same React tree.
          </p>
        </Portal>
      </div>

      <br />
      <CustomPortalContainer />

      <br />
      <ConditionalPortal />
    </div>
  );
}
