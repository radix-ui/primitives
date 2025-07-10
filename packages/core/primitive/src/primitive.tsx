/* eslint-disable no-restricted-properties */

/* eslint-disable no-restricted-globals */
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
/* eslint-enable no-restricted-globals */

export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

/* eslint-disable no-restricted-globals */
export function getOwnerWindow(element: Window | Document | Node | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access window outside of the DOM');
  }

  if (!element) {
    return window;
  }

  if ('self' in element) {
    return element.self;
  }

  return element.ownerDocument?.defaultView ?? window;
}
/* eslint-enable no-restricted-globals */

/* eslint-disable no-restricted-globals */
export function getOwnerDocument(element: Window | Document | Node | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access document outside of the DOM');
  }

  if (!element) {
    return document;
  }

  if ('self' in element) {
    return element.document;
  }

  return element.ownerDocument ?? document;
}
/* eslint-enable no-restricted-globals */

/**
 * Lifted from https://github.com/ariakit/ariakit/blob/main/packages/ariakit-core/src/utils/dom.ts#L37
 * MIT License, Copyright (c) AriaKit.
 */
export function getActiveElement(
  node: Node | null | undefined,
  activeDescendant = false
): HTMLElement | null {
  const { activeElement } = getOwnerDocument(node);
  if (!activeElement?.nodeName) {
    // `activeElement` might be an empty object if we're interacting with elements
    // inside of an iframe.
    return null;
  }

  if (isFrame(activeElement) && activeElement.contentDocument) {
    return getActiveElement(activeElement.contentDocument.body, activeDescendant);
  }

  if (activeDescendant) {
    const id = activeElement.getAttribute('aria-activedescendant');
    if (id) {
      const element = getOwnerDocument(activeElement).getElementById(id);
      if (element) {
        return element;
      }
    }
  }

  return activeElement as HTMLElement | null;
}

export function isFrame(element: Element): element is HTMLIFrameElement {
  return element.tagName === 'IFRAME';
}
