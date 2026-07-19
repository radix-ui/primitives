import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
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

// Regression test for https://github.com/radix-ui/primitives/issues/2906
describe('escape key removal', () => {
  afterEach(cleanup);

  function renderToasts(onOpenChange: { first: Mock; second: Mock; third: Mock }) {
    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.first}>
          <Toast.Title>Toast 1</Toast.Title>
        </Toast.Root>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.second}>
          <Toast.Title>Toast 2</Toast.Title>
        </Toast.Root>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.third}>
          <Toast.Title>Toast 3</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );
  }

  it('closes only the focused (non-topmost) toast on Escape', () => {
    const onOpenChange = { first: vi.fn(), second: vi.fn(), third: vi.fn() };
    renderToasts(onOpenChange);

    const focusedToast = screen.getByText('Toast 2').closest('li')!;
    focusedToast.focus();
    fireEvent.keyDown(focusedToast, { key: 'Escape' });

    expect(onOpenChange.second).toHaveBeenCalledWith(false);
    expect(onOpenChange.first).not.toHaveBeenCalled();
    expect(onOpenChange.third).not.toHaveBeenCalled();
  });

  it('closes the topmost toast on Escape when focus is outside any toast', () => {
    const onOpenChange = { first: vi.fn(), second: vi.fn(), third: vi.fn() };
    renderToasts(onOpenChange);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onOpenChange.third).toHaveBeenCalledWith(false);
    expect(onOpenChange.first).not.toHaveBeenCalled();
    expect(onOpenChange.second).not.toHaveBeenCalled();
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
