import * as React from 'react';
import { afterEach, describe, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as ScrollArea from './scroll-area';

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('ScrollArea ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the root', () => {
    assertStableComposedRef((ref) => (
      <ScrollArea.Root ref={ref}>
        <ScrollArea.Viewport>content</ScrollArea.Viewport>
      </ScrollArea.Root>
    ));
  });

  it('keeps a stable composed ref on the scrollbar', () => {
    assertStableComposedRef((ref) => (
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" ref={ref}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    ));
  });
});
