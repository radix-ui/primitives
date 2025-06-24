import * as React from 'react';
import { VisuallyHidden } from 'radix-ui';

export default function Page() {
  return (
    <div>
      You won't see this:
      <VisuallyHidden.Root>🙈</VisuallyHidden.Root>
    </div>
  );
}
