import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as Toast from './toast';
import { describe, it, afterEach, beforeEach, vi, expect } from 'vitest';

const TOAST_TITLE = 'Toast Title';

const ToastTest = ({ duration = 5000 }: { duration?: number }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <Toast.Provider duration={duration}>
      <Toast.Root open={open} onOpenChange={setOpen}>
        <Toast.Title>{TOAST_TITLE}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe('timer cleanup on unmount', () => {
    it('should clear the close timer when the component unmounts before duration expires', () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

      const { unmount } = render(<ToastTest duration={5000} />);

      // Advance time partially (not enough to trigger auto-close)
      vi.advanceTimersByTime(2000);

      // Unmount the component before the timer expires
      unmount();

      // Verify clearTimeout was called during cleanup
      expect(clearTimeoutSpy).toHaveBeenCalled();

      // Advance time past the original duration to ensure no errors occur
      // This would previously cause "ReferenceError: document is not defined" in test environments
      vi.advanceTimersByTime(5000);

      clearTimeoutSpy.mockRestore();
    });

    it('should not cause errors when unmounting with an active timer', () => {
      const { unmount } = render(<ToastTest duration={3000} />);

      // Advance time partially
      vi.advanceTimersByTime(1000);

      // This should not throw any errors
      expect(() => {
        unmount();
        // Advance past the timer duration
        vi.advanceTimersByTime(5000);
      }).not.toThrow();
    });
  });
});
