import { useDocument } from '@radix-ui/react-document-context';
import * as React from 'react';

/** Number of components which have requested interest to have focus guards */
let count = 0;

function FocusGuards(props: any) {
  useFocusGuards();
  return props.children;
}

/**
 * Injects a pair of focus guards at the edges of the whole DOM tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */
function useFocusGuards() {
  const providedDocument = useDocument();
  React.useEffect(() => {
    if (!providedDocument) return;
    const edgeGuards = providedDocument.querySelectorAll('[data-radix-focus-guard]');
    providedDocument.body.insertAdjacentElement(
      'afterbegin',
      edgeGuards[0] ?? createFocusGuard(providedDocument)
    );
    providedDocument.body.insertAdjacentElement(
      'beforeend',
      edgeGuards[1] ?? createFocusGuard(providedDocument)
    );
    count++;

    return () => {
      if (count === 1) {
        providedDocument
          .querySelectorAll('[data-radix-focus-guard]')
          .forEach((node) => node.remove());
      }
      count--;
    };
  }, [providedDocument]);
}

function createFocusGuard(providedDocument: Document) {
  const element = providedDocument.createElement('span');
  element.setAttribute('data-radix-focus-guard', '');
  element.tabIndex = 0;
  element.style.outline = 'none';
  element.style.opacity = '0';
  element.style.position = 'fixed';
  element.style.pointerEvents = 'none';
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
