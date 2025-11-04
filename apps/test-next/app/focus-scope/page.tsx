import * as React from 'react';
import * as FocusScope from '@repo/test-registry/components/focus-scope';

export default function Page() {
  return (
    <div>
      <FocusScope.Basic />
      <hr />
      <FocusScope.Multiple />
    </div>
  );
}
