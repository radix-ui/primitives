import * as React from 'react';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSize } from './use-size';

type BorderBoxSize = { inlineSize: number; blockSize: number };
type Entry = { borderBoxSize?: BorderBoxSize | BorderBoxSize[] };

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  callback: ResizeObserverCallback;
  observed = new Map<Element, ResizeObserverOptions | undefined>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    this.observed.set(target, options);
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  disconnect() {
    this.observed.clear();
  }

  /** Test-only helper to simulate the browser reporting a resize. */
  emit(entries: Entry[]) {
    this.callback(entries as unknown as ResizeObserverEntry[], this as unknown as ResizeObserver);
  }

  static get latest() {
    return MockResizeObserver.instances[MockResizeObserver.instances.length - 1]!;
  }

  static reset() {
    MockResizeObserver.instances = [];
  }
}

/* -------------------------------------------------------------------------------------------------
 * Mock `offsetWidth` / `offsetHeight` (jsdom returns `0` for both)
 * -----------------------------------------------------------------------------------------------*/

const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
let mockOffsetWidth = 0;
let mockOffsetHeight = 0;

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return mockOffsetWidth;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return mockOffsetHeight;
    },
  });
});

afterAll(() => {
  if (originalOffsetWidth) {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  }
  if (originalOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
  }
});

function SizeProbe({ element }: { element: HTMLElement | null }) {
  const size = useSize(element);
  return <div data-testid="output">{size ? `${size.width}x${size.height}` : 'none'}</div>;
}

/**
 * Renders a real element into the DOM, then reports its measured size. Toggling `disabled`
 * passes `null` to `useSize` to exercise the reset path.
 */
function Harness({ disabled = false }: { disabled?: boolean }) {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <div ref={setNode} data-testid="box" />
      <SizeProbe element={disabled ? null : node} />
    </>
  );
}

function getOutput() {
  return screen.getByTestId('output').textContent;
}

describe('useSize', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    MockResizeObserver.reset();
    mockOffsetWidth = 0;
    mockOffsetHeight = 0;
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns `undefined` when the element is `null`', () => {
    render(<SizeProbe element={null} />);
    expect(getOutput()).toBe('none');
    expect(MockResizeObserver.instances).toHaveLength(0);
  });

  it('provides the size synchronously from offset dimensions on mount', () => {
    mockOffsetWidth = 120;
    mockOffsetHeight = 40;
    render(<Harness />);
    // Available immediately (during the layout effect), before any observer callback fires.
    expect(getOutput()).toBe('120x40');
  });

  it('observes the element using the `border-box` box model', () => {
    render(<Harness />);
    const box = screen.getByTestId('box');
    const observer = MockResizeObserver.latest;
    expect(observer.observed.has(box)).toBe(true);
    expect(observer.observed.get(box)).toEqual({ box: 'border-box' });
  });

  it('updates the size from `borderBoxSize` reported as an array', async () => {
    render(<Harness />);
    act(() => {
      MockResizeObserver.latest.emit([{ borderBoxSize: [{ inlineSize: 200, blockSize: 100 }] }]);
    });
    await waitFor(() => expect(getOutput()).toBe('200x100'));
  });

  it('updates the size from `borderBoxSize` reported as a plain object', async () => {
    render(<Harness />);
    act(() => {
      MockResizeObserver.latest.emit([{ borderBoxSize: { inlineSize: 320, blockSize: 240 } }]);
    });
    await waitFor(() => expect(getOutput()).toBe('320x240'));
  });

  it('falls back to offset dimensions when `borderBoxSize` is unavailable', async () => {
    mockOffsetWidth = 55;
    mockOffsetHeight = 66;
    render(<Harness />);
    act(() => {
      // No `borderBoxSize` key; read `offsetWidth`/`offsetHeight`.
      MockResizeObserver.latest.emit([{}]);
    });
    await waitFor(() => expect(getOutput()).toBe('55x66'));
  });

  it('ignores empty or non-array observer payloads', async () => {
    mockOffsetWidth = 10;
    mockOffsetHeight = 20;
    render(<Harness />);
    expect(getOutput()).toBe('10x20');
    act(() => {
      MockResizeObserver.latest.emit([]);
      MockResizeObserver.latest.callback(
        undefined as unknown as ResizeObserverEntry[],
        MockResizeObserver.latest as unknown as ResizeObserver,
      );
    });
    // Give any (unexpected) scheduled frame a chance to run.
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    expect(getOutput()).toBe('10x20');
  });

  it('resets the size to `undefined` when the element becomes `null`', async () => {
    mockOffsetWidth = 80;
    mockOffsetHeight = 30;
    const { rerender } = render(<Harness />);
    expect(getOutput()).toBe('80x30');
    rerender(<Harness disabled />);
    await waitFor(() => expect(getOutput()).toBe('none'));
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2313
  describe('requestAnimationFrame batching', () => {
    it('defers observer-driven updates to the next animation frame', async () => {
      mockOffsetWidth = 10;
      mockOffsetHeight = 10;
      render(<Harness />);
      expect(getOutput()).toBe('10x10');

      act(() => {
        MockResizeObserver.latest.emit([{ borderBoxSize: { inlineSize: 300, blockSize: 300 } }]);
      });

      // The DOM has not changed synchronously
      expect(getOutput()).toBe('10x10');
      await waitFor(() => expect(getOutput()).toBe('300x300'));
    });

    it('coalesces rapid observations, cancelling the previously scheduled frames', async () => {
      render(<Harness />);
      // Spy after mount so we only capture frames scheduled by the observations.
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

      act(() => {
        MockResizeObserver.latest.emit([{ borderBoxSize: { inlineSize: 1, blockSize: 1 } }]);
        MockResizeObserver.latest.emit([{ borderBoxSize: { inlineSize: 2, blockSize: 2 } }]);
        MockResizeObserver.latest.emit([{ borderBoxSize: { inlineSize: 3, blockSize: 3 } }]);
      });

      // Each new observation cancels the frame scheduled by the previous one, so
      // the frames from the first two observations are explicitly cancelled.
      const scheduledIds = rafSpy.mock.results.map((result) => result.value as number);
      expect(scheduledIds).toHaveLength(3);
      expect(cancelSpy).toHaveBeenCalledWith(scheduledIds[0]);
      expect(cancelSpy).toHaveBeenCalledWith(scheduledIds[1]);

      // Only the final observation is reflected in the measured size.
      await waitFor(() => expect(getOutput()).toBe('3x3'));
    });

    it('cancels a pending frame and un-observes on unmount', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
      const { unmount } = render(<Harness />);
      const box = screen.getByTestId('box');
      const observer = MockResizeObserver.latest;

      act(() => {
        observer.emit([{ borderBoxSize: { inlineSize: 500, blockSize: 500 } }]);
      });
      const scheduledId = rafSpy.mock.results.at(-1)!.value as number;

      unmount();

      expect(cancelSpy).toHaveBeenCalledWith(scheduledId);
      expect(observer.observed.has(box)).toBe(false);
    });

    it('does not warn or error when unmounted before a pending frame runs', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<Harness />);
      const observer = MockResizeObserver.latest;
      act(() => {
        observer.emit([{ borderBoxSize: { inlineSize: 999, blockSize: 999 } }]);
      });

      // Unmount before the scheduled frame runs. Because the pending frame is
      // cancelled on cleanup, no state update happens on the unmounted
      // component and React does not log a warning/error.
      cleanup();
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      expect(consoleError).not.toHaveBeenCalled();
    });
  });
});
