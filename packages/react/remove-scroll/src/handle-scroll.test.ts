import { afterEach, describe, expect, it } from 'vitest';
import { handleScroll, locationCouldBeScrolled } from './handle-scroll';

/* -------------------------------------------------------------------------------------------------
 * jsdom has no layout engine: `scrollHeight`/`clientHeight`/`scrollTop` are always `0` and
 * read-only, and `getComputedStyle` only reflects inline styles. These helpers fabricate the
 * geometry the pure scroll math reads, so we can exercise the real algorithm deterministically.
 * -----------------------------------------------------------------------------------------------*/

interface ScrollGeometry {
  overflowX?: string;
  overflowY?: string;
  scrollTop?: number;
  scrollHeight?: number;
  clientHeight?: number;
  scrollLeft?: number;
  scrollWidth?: number;
  clientWidth?: number;
}

const created: HTMLElement[] = [];

function makeElement(tag: string, geometry: ScrollGeometry = {}): HTMLElement {
  const el = document.createElement(tag);
  if (geometry.overflowX !== undefined) el.style.overflowX = geometry.overflowX;
  if (geometry.overflowY !== undefined) el.style.overflowY = geometry.overflowY;
  const numeric: (keyof ScrollGeometry)[] = [
    'scrollTop',
    'scrollHeight',
    'clientHeight',
    'scrollLeft',
    'scrollWidth',
    'clientWidth',
  ];
  for (const key of numeric) {
    if (geometry[key] !== undefined) {
      Object.defineProperty(el, key, { configurable: true, value: geometry[key] });
    }
  }
  return el;
}

/** Build a detached tree (child -> ...parents-> body-attached root) and register for cleanup. */
function mount(el: HTMLElement): HTMLElement {
  document.body.appendChild(el);
  created.push(el);
  return el;
}

afterEach(() => {
  while (created.length) created.pop()!.remove();
});

describe('locationCouldBeScrolled', () => {
  it('is true for an element that overflows and is scrollable on the axis', () => {
    const node = mount(
      makeElement('div', { overflowY: 'auto', scrollHeight: 200, clientHeight: 100 }),
    );
    expect(locationCouldBeScrolled('v', node)).toBe(true);
  });

  it('is false when overflow is hidden', () => {
    const node = mount(
      makeElement('div', { overflowY: 'hidden', scrollHeight: 200, clientHeight: 100 }),
    );
    expect(locationCouldBeScrolled('v', node)).toBe(false);
  });

  it('is false when content does not exceed the client size', () => {
    const node = mount(
      makeElement('div', { overflowY: 'auto', scrollHeight: 100, clientHeight: 100 }),
    );
    expect(locationCouldBeScrolled('v', node)).toBe(false);
  });

  // Regression: https://github.com/theKashey/react-remove-scroll/issues/74
  it('treats a textarea as always containing scroll (even with visible overflow)', () => {
    const node = mount(
      makeElement('textarea', {
        overflowY: 'visible',
        overflowX: 'visible',
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    expect(locationCouldBeScrolled('v', node)).toBe(true);
  });

  it('walks up to a scrollable ancestor', () => {
    const scrollableParent = makeElement('div', {
      overflowY: 'auto',
      scrollHeight: 300,
      clientHeight: 100,
    });
    const child = makeElement('div');
    scrollableParent.appendChild(child);
    mount(scrollableParent);
    expect(locationCouldBeScrolled('v', child)).toBe(true);
  });

  it('detects horizontal scrollability on the h axis', () => {
    const node = mount(
      makeElement('div', { overflowX: 'auto', scrollWidth: 200, clientWidth: 100 }),
    );
    expect(locationCouldBeScrolled('h', node)).toBe(true);
  });

  // Regression: https://github.com/theKashey/react-remove-scroll/issues/45
  it('crosses a shadow DOM boundary to find a scrollable ancestor', () => {
    const outer = makeElement('div', { overflowY: 'auto', scrollHeight: 300, clientHeight: 100 });
    const host = document.createElement('div');
    outer.appendChild(host);
    mount(outer);
    const shadow = host.attachShadow({ mode: 'open' });
    const child = document.createElement('div');
    shadow.appendChild(child);
    expect(locationCouldBeScrolled('v', child)).toBe(true);
  });
});

describe('handleScroll (overscroll cancellation)', () => {
  it('allows scrolling down while the target still has room', () => {
    const target = mount(
      makeElement('div', {
        overflowY: 'scroll',
        scrollTop: 0,
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    // delta > 0 (down), noOverscroll = true. There are 100px of room, so it is NOT cancelled.
    expect(handleScroll('v', target, { target }, 10, true)).toBe(false);
  });

  it('cancels scrolling down once the target is at the bottom', () => {
    const target = mount(
      makeElement('div', {
        overflowY: 'scroll',
        scrollTop: 100,
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    expect(handleScroll('v', target, { target }, 10, true)).toBe(true);
  });

  it('cancels scrolling up once the target is at the top', () => {
    const target = mount(
      makeElement('div', {
        overflowY: 'scroll',
        scrollTop: 0,
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    expect(handleScroll('v', target, { target }, -10, true)).toBe(true);
  });
});

describe('handleScroll (horizontal axis, LTR)', () => {
  it('allows scrolling right while the target still has room', () => {
    const target = mount(
      makeElement('div', {
        overflowX: 'scroll',
        scrollLeft: 0,
        scrollWidth: 200,
        clientWidth: 100,
      }),
    );
    expect(handleScroll('h', target, { target }, 10, true)).toBe(false);
  });

  it('cancels scrolling right once the target is at the end', () => {
    const target = mount(
      makeElement('div', {
        overflowX: 'scroll',
        scrollLeft: 100,
        scrollWidth: 200,
        clientWidth: 100,
      }),
    );
    expect(handleScroll('h', target, { target }, 10, true)).toBe(true);
  });

  // Deferred: needs mocking `getComputedStyle(...).direction === 'rtl'` (jsdom returns 'ltr');
  // better exercised in a real browser via the `lock--rtl-horizontal` story.
  it.todo(
    'respects RTL direction (negative scrollLeft) when computing horizontal available scroll',
  );
});

describe('handleScroll (target outside the lock — portaled/shard)', () => {
  it('allows scrolling an outside target that still has room', () => {
    const lock = mount(makeElement('div'));
    const shard = mount(
      makeElement('div', {
        overflowY: 'scroll',
        scrollTop: 0,
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    expect(handleScroll('v', lock, { target: shard }, 10, true)).toBe(false);
  });

  it('cancels when the outside target has no room left', () => {
    const lock = mount(makeElement('div'));
    const shard = mount(
      makeElement('div', {
        overflowY: 'scroll',
        scrollTop: 100,
        scrollHeight: 200,
        clientHeight: 100,
      }),
    );
    expect(handleScroll('v', lock, { target: shard }, 10, true)).toBe(true);
  });
});

/* -------------------------------------------------------------------------------------------------
 * Deferred: the touch/pinch decision currently lives as a closure inside the sidecar effect
 * (`shouldCancelEvent`). The refactor extracts it into a pure, exported function in `scroll.ts`,
 * at which point these become real unit tests. (ctrl+wheel, event.cancelable, and isolation are
 * integration-level and are covered in `remove-scroll.test.tsx`.)
 * -----------------------------------------------------------------------------------------------*/
describe('shouldCancelEvent (deferred: extract pure touch/pinch decision into scroll.ts)', () => {
  it.todo('allows horizontal touchmove on input[type=range] — #59/#64');
  it.todo('blocks a two-finger touch (pinch) unless allowPinchZoom is set');
  it.todo('does not block a touch that is dragging an active text selection');
});
