import * as React from 'react';

/** Number of components which have requested interest to have focus guards */
let count = 0;

/**
 * Cached references to the single shared pair of edge guards. Keeping these at
 * module scope lets us avoid scanning the whole document (`querySelectorAll`)
 * and re-inserting the guards on every overlay mount.
 */
let guards: { start: HTMLSpanElement; end: HTMLSpanElement } | null = null;

interface FocusGuardsProps {
  children?: React.ReactNode;
}

function FocusGuards(props: FocusGuardsProps) {
  useFocusGuards();
  return props.children;
}

/**
 * Injects a pair of focus guards at the edges of the whole DOM tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */
function useFocusGuards() {
  React.useEffect(() => {
    if (!guards) {
      guards = { start: createFocusGuard(), end: createFocusGuard() };
    }
    const { start, end } = guards;

    // Only mutate the DOM when the edge invariant is actually broken. Writing
    // to `document.body` dirties layout and forces a synchronous reflow once
    // sibling effects read layout (Popper measuring, react-remove-scroll,
    // aria-hidden, FocusScope), so skipping no-op moves avoids that cost on
    // every mount. The trailing guard still gets re-asserted to last whenever a
    // newly portaled node lands after it (portals append to the end of
    // `document.body`). See https://github.com/radix-ui/primitives/issues/2812
    if (document.body.firstElementChild !== start) {
      document.body.insertAdjacentElement('afterbegin', start);
    }
    if (document.body.lastElementChild !== end) {
      document.body.insertAdjacentElement('beforeend', end);
    }
    count++;

    return () => {
      if (count === 1) {
        guards?.start.remove();
        guards?.end.remove();
        guards = null;
      }
      count = Math.max(0, count - 1);
    };
  }, []);
}

function createFocusGuard() {
  const element = document.createElement('span');
  element.setAttribute('data-radix-focus-guard', '');
  element.tabIndex = 0;
  element.style.outline = 'none';
  element.style.opacity = '0';
  element.style.position = 'fixed';
  element.style.pointerEvents = 'none';
  return element;
}

export {
  FocusGuards,
  //
  FocusGuards as Root,
  //
  useFocusGuards,
};
