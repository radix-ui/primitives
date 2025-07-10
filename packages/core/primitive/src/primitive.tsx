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

export function getOwnerWindow(element: Element | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access window outside of the DOM');
  }
  // eslint-disable-next-line no-restricted-globals
  return element?.ownerDocument?.defaultView ?? window;
}

export function getOwnerDocument(element: Element | null | undefined) {
  if (!canUseDOM) {
    throw new Error('Cannot access document outside of the DOM');
  }
  // eslint-disable-next-line no-restricted-globals
  return element?.ownerDocument ?? document;
}
