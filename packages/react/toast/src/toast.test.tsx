import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as Toast from './toast';
import { describe, it, afterEach, beforeEach, vi, expect, type Mock } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';

// Regression test for https://github.com/radix-ui/primitives/issues/3963
describe('ref stability', () => {
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

// Regression test for https://github.com/radix-ui/primitives/pull/3703
describe('timer cleanup', () => {
  let clearTimeoutSpy: Mock<(id: number | undefined) => void>;
  beforeEach(() => {
    vi.useFakeTimers();
    clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
  });

  afterEach(() => {
    clearTimeoutSpy.mockRestore();
    cleanup();
    vi.useRealTimers();
  });

  it('should clear the close timer when the component unmounts before duration expires', () => {
    const { unmount } = render(
      <Toast.Provider duration={5000}>
        <Toast.Root defaultOpen>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    // Advance time but not enough to trigger auto-close
    vi.advanceTimersByTime(1000);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should not error when unmounting before time expires', () => {
    const { unmount } = render(
      <Toast.Provider duration={5000}>
        <Toast.Root defaultOpen>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    // Advance time but not enough to trigger auto-close
    vi.advanceTimersByTime(1000);

    expect(() => {
      unmount();
      // Advance time past the original duration to ensure no errors occur. In
      // test environments, the dangling timeout would cause "ReferenceError:
      // document is not defined" errors since the DOM test environment would have
      // been torn down by this point.
      vi.advanceTimersByTime(5000);
    }).not.toThrow();
  });
});
