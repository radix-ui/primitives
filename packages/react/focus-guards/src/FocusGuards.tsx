import * as React from 'react';

/** Number of components which have requested interest to have focus guards */
let count = 0;

function FocusGuards(props: any) {
  useFocusGuards(props.ownerDocument);
  return props.children;
}

/**
 * Injects a pair of focus guards at the edges of the whole DOM tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */
function useFocusGuards(ownerDocument = document) {
  React.useEffect(() => {
    const edgeGuards = ownerDocument.querySelectorAll('[data-radix-focus-guard]');
    ownerDocument.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard());
    ownerDocument.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard());
    count++;

    return () => {
      if (count === 1) {
        ownerDocument.querySelectorAll('[data-radix-focus-guard]').forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
}

function createFocusGuard(ownerDocument = document) {
  const element = ownerDocument.createElement('span');
  element.setAttribute('data-radix-focus-guard', '');
  element.tabIndex = 0;
  element.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none';
  return element;
}

const Root = FocusGuards;

export {
  FocusGuards,
  //
  Root,
  //
  useFocusGuards,
};
