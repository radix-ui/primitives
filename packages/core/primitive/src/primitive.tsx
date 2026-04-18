/* eslint-disable no-restricted-properties */

/* eslint-disable no-restricted-globals */
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
/* eslint-enable no-restricted-globals */

/**
 * Composes event handlers without checking for defaultPrevented.
 * Both the original and our handler are always called.
 */
export function composeEvent<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    ourEventHandler?.(event);
  };
}

/**
 * Composes event handlers where our handler is only called if
 * default was not prevented by the original handler.
 */
export function composePreventableEvent<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    if (!event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * @deprecated Use `composeEvent` or `composePreventableEvent` instead.
 * This function is kept for backward compatibility.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export function getOwnerWindow(element: Node | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access window outside of the DOM');
  }
  // eslint-disable-next-line no-restricted-globals
  return element?.ownerDocument?.defaultView ?? window;
}

export function getOwnerDocument(element: Node | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access document outside of the DOM');
  }
  // eslint-disable-next-line no-restricted-globals
  return element?.ownerDocument ?? document;
}

/**
 * Lifted from https://github.com/ariakit/ariakit/blob/main/packages/ariakit-core/src/utils/dom.ts#L37
 * MIT License, Copyright (c) AriaKit.
 */
export function getActiveElement(
  node: Node | null | undefined,
  activeDescendant = false,
): HTMLElement | null {
  const { activeElement } = getOwnerDocument(node);
  if (!activeElement?.nodeName) {
    // `activeElement` might be an empty object if we're interacting with elements
    // inside of iframes.
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
