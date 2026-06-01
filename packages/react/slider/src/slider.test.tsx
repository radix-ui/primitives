import * as React from 'react';
import { cleanup, render, fireEvent, act } from '@testing-library/react';
import * as Slider from '.';
import { afterEach, beforeEach, describe, it, vi, expect } from 'vitest';

if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public readonly pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
    }
  }
  (window as any).PointerEvent = PointerEvent;
}

const capturedElements = new Set<EventTarget>();

beforeEach(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn(function (this: HTMLElement) {
    capturedElements.add(this);
  }) as typeof HTMLElement.prototype.setPointerCapture;
  HTMLElement.prototype.releasePointerCapture = vi.fn(function (this: HTMLElement) {
    capturedElements.delete(this);
  }) as typeof HTMLElement.prototype.releasePointerCapture;
  HTMLElement.prototype.hasPointerCapture = vi.fn(function (this: HTMLElement) {
    return capturedElements.has(this);
  }) as typeof HTMLElement.prototype.hasPointerCapture;

  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 200,
    bottom: 10,
    width: 200,
    height: 10,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  });
});

afterEach(() => {
  capturedElements.clear();
  vi.restoreAllMocks();
  cleanup();
});

function RangeSlider(props: Partial<React.ComponentProps<typeof Slider.Root>>) {
  return (
    <Slider.Root min={100} max={200} {...props}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb />
      <Slider.Thumb />
    </Slider.Root>
  );
}

describe('Slider', () => {
  describe('range slider — onValueCommit', () => {
    it('calls onValueCommit when the range is narrowed to a single value from the right', async () => {
      const onValueCommit = vi.fn();

      render(<RangeSlider defaultValue={[105, 107]} onValueCommit={onValueCommit} />);

      const track = document.querySelector('[data-orientation="horizontal"]') as HTMLElement;

      await act(async () => {
        fireEvent.pointerDown(track, { clientX: 14, pointerId: 1, buttons: 1 });
      });
      await act(async () => {
        fireEvent.pointerMove(track, { clientX: 10, pointerId: 1, buttons: 1 });
      });
      await act(async () => {
        fireEvent.pointerUp(track, { clientX: 10, pointerId: 1 });
      });

      expect(onValueCommit).toHaveBeenCalledWith([105, 105]);
    });

    it('calls onValueCommit when the value changes from the left thumb', async () => {
      const onValueCommit = vi.fn();

      render(<RangeSlider defaultValue={[105, 107]} onValueCommit={onValueCommit} />);

      const track = document.querySelector('[data-orientation="horizontal"]') as HTMLElement;

      await act(async () => {
        fireEvent.pointerDown(track, { clientX: 10, pointerId: 1, buttons: 1 });
      });
      await act(async () => {
        fireEvent.pointerMove(track, { clientX: 0, pointerId: 1, buttons: 1 });
      });
      await act(async () => {
        fireEvent.pointerUp(track, { clientX: 0, pointerId: 1 });
      });

      expect(onValueCommit).toHaveBeenCalledWith([100, 107]);
    });

    it('does not call onValueCommit when the value does not change', async () => {
      const onValueCommit = vi.fn();

      render(<RangeSlider defaultValue={[105, 107]} onValueCommit={onValueCommit} />);

      const track = document.querySelector('[data-orientation="horizontal"]') as HTMLElement;

      await act(async () => {
        fireEvent.pointerDown(track, { clientX: 14, pointerId: 1, buttons: 1 });
      });
      await act(async () => {
        fireEvent.pointerUp(track, { clientX: 14, pointerId: 1 });
      });

      expect(onValueCommit).not.toHaveBeenCalled();
    });
  });
});
