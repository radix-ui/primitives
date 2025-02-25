import * as React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function Page() {
  return (
    <div>
      You won't see this:
      <VisuallyHidden>🙈</VisuallyHidden>
    </div>
  );
}
