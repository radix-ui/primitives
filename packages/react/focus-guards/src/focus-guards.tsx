import * as React from 'react';

/** Number of components which have requested interest to have focus guards */
let count = 0;

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
  /* eslint-disable no-restricted-globals */
  React.useEffect(() => {
    const edgeGuards = document.querySelectorAll('[data-radix-focus-guard]');
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard());
    count++;

    return () => {
      if (count === 1) {
        document.querySelectorAll('[data-radix-focus-guard]').forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
  /* eslint-enable no-restricted-globals */
}

function createFocusGuard() {
  // eslint-disable-next-line no-restricted-globals
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
