import * as React from 'react';
import { VisuallyHidden } from 'radix-ui';

export function Basic() {
  return (
    <div>
      You won&apos;t see this:
      <VisuallyHidden.Root>🙈</VisuallyHidden.Root>
    </div>
  );
}
