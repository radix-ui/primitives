import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { RemoveScroll } from './remove-scroll';

const LOCK_ATTR = 'data-scroll-locked';
const REMOVED_BAR_VAR = '--removed-body-scroll-bar-size';

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));
const lockCount = () => document.body.getAttribute(LOCK_ATTR);
const hasLockStyle = () =>
  Array.from(document.querySelectorAll('style')).some((style) =>
    style.textContent?.includes(REMOVED_BAR_VAR),
  );
const styleText = () =>
  Array.from(document.querySelectorAll('style'))
    .map((style) => style.textContent ?? '')
    .join('\n');

afterEach(cleanup);

/**
 * These tests target invariant *behavior* through the public `RemoveScroll` component (not the
 * internal sidecar/UI wiring), so they act as a regression harness that must stay green across
 * every stage of the refactor.
 */
describe('RemoveScroll', () => {
  describe('rendering', () => {
    it('renders children inside a div by default', async () => {
      const { container } = render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(container.querySelector('div')?.textContent).toBe('content');
    });

    it('forwards className, style, and arbitrary props to the host element', async () => {
      const { container } = render(
        <RemoveScroll className="lock" style={{ color: 'red' }} data-foo="bar">
          content
        </RemoveScroll>,
      );
      await tick();
      const host = container.querySelector('div')!;
      expect(host.className).toContain('lock');
      expect(host.style.color).toBe('red');
      expect(host.getAttribute('data-foo')).toBe('bar');
    });

    it('composes a forwarded ref to the host element', async () => {
      const ref = React.createRef<HTMLElement>();
      render(<RemoveScroll ref={ref}>content</RemoveScroll>);
      await tick();
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.textContent).toBe('content');
    });
  });

  describe('scroll bar removal', () => {
    it('locks the body on mount and releases it on unmount', async () => {
      expect(lockCount()).toBeNull();
      const { unmount } = render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBe('1');
      expect(hasLockStyle()).toBe(true);
      unmount();
      expect(lockCount()).toBeNull();
    });

    it('injects the removed-scroll-bar-size custom property and overflow hidden', async () => {
      render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      const styleText = Array.from(document.querySelectorAll('style'))
        .map((style) => style.textContent ?? '')
        .join('\n');
      expect(styleText).toContain(REMOVED_BAR_VAR);
      expect(styleText).toContain('overflow: hidden');
    });

    it('ref-counts nested locks on the body', async () => {
      function Locks({ n }: { n: number }) {
        return (
          <>
            {Array.from({ length: n }).map((_, i) => (
              <RemoveScroll key={i}>content {i}</RemoveScroll>
            ))}
          </>
        );
      }
      const { rerender, unmount } = render(<Locks n={2} />);
      await tick();
      expect(lockCount()).toBe('2');
      rerender(<Locks n={1} />);
      await tick();
      expect(lockCount()).toBe('1');
      unmount();
      expect(lockCount()).toBeNull();
    });

    it('does not lock the body when removeScrollBar is false', async () => {
      render(<RemoveScroll removeScrollBar={false}>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBeNull();
    });

    it('does not lock the body when disabled, and locks once enabled', async () => {
      const { rerender } = render(<RemoveScroll enabled={false}>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBeNull();
      rerender(<RemoveScroll enabled={true}>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBe('1');
    });
  });

  describe('document listeners & lifecycle', () => {
    it('attaches wheel/touchmove/touchstart document listeners on mount and removes them on unmount', async () => {
      const add = vi.spyOn(document, 'addEventListener');
      const remove = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      const added = add.mock.calls.map((call) => call[0]);
      expect(added).toEqual(expect.arrayContaining(['wheel', 'touchmove', 'touchstart']));
      unmount();
      const removed = remove.mock.calls.map((call) => call[0]);
      expect(removed).toEqual(expect.arrayContaining(['wheel', 'touchmove', 'touchstart']));
      add.mockRestore();
      remove.mockRestore();
    });

    it('releases the lock when `enabled` flips from true to false', async () => {
      const { rerender } = render(<RemoveScroll enabled={true}>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBe('1');
      rerender(<RemoveScroll enabled={false}>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBeNull();
    });

    it('recovers the lock counter when the body attribute holds a non-numeric value', async () => {
      document.body.setAttribute(LOCK_ATTR, 'not-a-number');
      const { unmount } = render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(lockCount()).toBe('1');
      unmount();
      expect(lockCount()).toBeNull();
    });
  });

  describe('inert', () => {
    it('adds a block-interactivity class to the body while mounted and removes it on unmount', async () => {
      const { unmount } = render(<RemoveScroll inert>content</RemoveScroll>);
      await tick();
      expect(document.body.className).toMatch(/^block-interactivity-\d+$/);
      unmount();
      expect(document.body.className).toBe('');
    });
  });

  describe('public classNames', () => {
    it('exposes the fixed-element helper class names', () => {
      expect(RemoveScroll.classNames.fullWidth).toBe('width-before-scroll-bar');
      expect(RemoveScroll.classNames.zeroRight).toBe('right-scroll-bar-position');
    });
  });

  /* -----------------------------------------------------------------------------------------------
   * Deferred: these cover behavior introduced by the refactor and can't pass on the current
   * (sidecar/`as`+`forwardProps`, global-nonce) implementation. Implement them at the stage that
   * introduces each feature. Kept as `todo` so they're not forgotten.
   * ---------------------------------------------------------------------------------------------*/
  describe('asChild (deferred: Primitive/asChild migration)', () => {
    it.todo('renders the child element directly, without an extra wrapper node');
    it.todo('merges className/style/event handlers and composes ref onto the child');
    it.todo('throws/handles gracefully when given multiple or non-element children');
  });

  describe('nonce prop (deferred: nonce becomes a prop, get-nonce/setNonce removed)', () => {
    it.todo('applies the nonce prop to the injected <style> tag(s)');
    it.todo('does not set a nonce attribute when the prop is omitted');
  });

  describe('scroll bar removal — gap compensation', () => {
    it('compensates the gap with margin by default (gapMode="margin")', async () => {
      render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(styleText()).toContain('margin-left:0');
    });

    it('compensates the gap with padding when gapMode="padding"', async () => {
      render(<RemoveScroll gapMode="padding">content</RemoveScroll>);
      await tick();
      const text = styleText();
      expect(text).toContain('padding-right');
      expect(text).not.toContain('margin-left:0');
    });

    it('omits `position: relative` on the body when `noRelative` is set', async () => {
      render(<RemoveScroll noRelative>content</RemoveScroll>);
      await tick();
      expect(styleText()).not.toContain('position: relative');
    });

    it('sets `position: relative` on the body by default', async () => {
      render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(styleText()).toContain('position: relative');
    });

    it.todo('keeps a consistent gap across nested locks — no override to 0 (radix #1925)');
    it.todo('does nothing when there is no scrollbar gap to compensate');
    // NOTE: true SSR (no `document`) must be exercised outside jsdom (or with `document` mocked
    // away); the current `if (!document)` path throws in a real server environment.
    it.todo('is SSR-safe: renders without touching a missing document (run outside jsdom)');
  });

  describe('event prevention (isolation)', () => {
    const wheelOutsideLock = (init: WheelEventInit) => {
      const outside = document.createElement('div');
      document.body.appendChild(outside);
      const event = new WheelEvent('wheel', { deltaY: 10, bubbles: true, ...init });
      outside.dispatchEvent(event);
      outside.remove();
      return event;
    };

    it('prevents a cancelable wheel event targeting outside the lock', async () => {
      render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(wheelOutsideLock({ cancelable: true }).defaultPrevented).toBe(true);
    });

    it('does not prevent outside wheel events when `noIsolation` is set', async () => {
      render(<RemoveScroll noIsolation>content</RemoveScroll>);
      await tick();
      expect(wheelOutsideLock({ cancelable: true }).defaultPrevented).toBe(false);
    });

    // Regression: https://github.com/theKashey/react-remove-scroll/issues/8
    it('does not attempt to prevent a non-cancelable event', async () => {
      render(<RemoveScroll>content</RemoveScroll>);
      await tick();
      expect(wheelOutsideLock({ cancelable: false }).defaultPrevented).toBe(false);
    });

    it.todo('blocks ctrl+wheel (pinch zoom) unless `allowPinchZoom` is set');
    it.todo('only the topmost of stacked locks prevents document scroll (lockStack)');
  });

  describe('live props (deferred: refactor must keep listeners reading current props)', () => {
    it.todo('reacts to `allowPinchZoom` changing while mounted');
    it.todo('reacts to `shards` changing while mounted');
  });
});
