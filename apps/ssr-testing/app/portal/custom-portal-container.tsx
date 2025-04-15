'use client';

import * as React from 'react';
import { Portal } from 'radix-ui';

export const CustomPortalContainer = () => {
  const [container, setContainer] = React.useState<Element | null>(null);
  return (
    <div>
      <em ref={setContainer} />
      <Portal.Root container={container}>
        <span>This content is rendered in a custom container</span>
      </Portal.Root>
    </div>
  );
};
