import * as React from 'react';
import { afterEach, describe, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as Toast from './toast';

// Regression test for https://github.com/radix-ui/primitives/issues/3963
describe('Toast ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the Toast root', () => {
    assertStableComposedRef((ref) => (
      <Toast.Provider>
        <Toast.Root ref={ref} open>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    ));
  });
});
