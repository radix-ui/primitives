import { tabbable } from 'tabbable';

type FocusableTarget = HTMLElement | { focus(): void };

type FocusTrapState = {
  container: HTMLElement;
  lastFocusedElementInsideContainer: HTMLElement | null;
  beforeFocusTrapMarker: HTMLElement;
  afterFocusTrapMarker: HTMLElement;
};

/* -------------------------------------------------------------------------------------------------
 * createFocusTrap
 * -----------------------------------------------------------------------------------------------*/

function createFocusTrap(container: HTMLElement) {
  // We keep track of some internal state
  const state: FocusTrapState = {
    container,
    lastFocusedElementInsideContainer: null,
    // In order to perform the focus trapping, we create (and later inject) 2 focusable marker elements.
    // One is injected just before the focus trap, and the other just after it.
    //
    // Their function is twofold:
    //
    // - when the focus escapes the focus trap, it ensures one of these will be focused with no visual feedback.
    // - they serve as markers to know which direction the user was tabbing through
    beforeFocusTrapMarker: createFocusTrapMarkerElement('before'),
    afterFocusTrapMarker: createFocusTrapMarkerElement('after'),
  };

  // setup
  const makeContainerNonFocusable = makeContainerFocusable(state.container);
  const removeFocusTrapMarkers = addFocusTrapMarkers(state);
  const removeFocusBlurListeners = addFocusBlurListeners(state);

  // teardown
  return function destroyFocusTrap() {
    makeContainerNonFocusable();
    removeFocusTrapMarkers();
    removeFocusBlurListeners();
  };
}

/* -------------------------------------------------------------------------------------------------
 * Major utils
 * -----------------------------------------------------------------------------------------------*/

function createFocusTrapMarkerElement(position: 'before' | 'after') {
  const focusTrapMarkerElement = document.createElement('span');
  focusTrapMarkerElement.setAttribute('data-focus-trap-marker', position);
  focusTrapMarkerElement.tabIndex = 0;
  return focusTrapMarkerElement;
}

function makeContainerFocusable(container: HTMLElement) {
  container.setAttribute('data-focus-trap-container', 'true');
  container.tabIndex = -1;

  return function makeContainerNonFocusable() {
    container.removeAttribute('data-focus-trap-container');
    container.removeAttribute('tabIndex');
  };
}

function addFocusTrapMarkers(state: FocusTrapState) {
  const { container, beforeFocusTrapMarker, afterFocusTrapMarker } = state;
  const parent = container.parentNode;
  parent?.insertBefore(beforeFocusTrapMarker, container);
  parent?.insertBefore(afterFocusTrapMarker, container.nextSibling);

  return function removeFocusTrapMarkers() {
    beforeFocusTrapMarker.remove();
    afterFocusTrapMarker.remove();
  };
}

function addFocusBlurListeners(state: FocusTrapState) {
  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Element | null;
    // We only need to respond to a blur event if another element outside is receiving focus.
    // https://github.com/modulz/modulz/pull/1215
    if (relatedTarget && isTargetOutsideElement(relatedTarget, state.container)) {
      handleFocusOutside(relatedTarget);
    }
  }

  function handleFocus({ target }: FocusEvent) {
    if (isTargetOutsideElement(target, state.container)) {
      handleFocusOutside(target as Element);
    } else {
      state.lastFocusedElementInsideContainer = target as HTMLElement;
    }
  }

  function handleFocusOutside(elementReceivingFocus: Element | null) {
    // If we got here, it means the focus event was technically outside the container.
    // We do an extra check for focus within any focus trap container. This is because focus trap containers
    // are not always truly nested in the DOM (ie. when used within a Portal)
    if (elementReceivingFocus?.closest('[data-focus-trap-container=true]')) {
      // in such case we allow manually focusing into parent locks (via click)
      return;
    }

    if (elementReceivingFocus === state.beforeFocusTrapMarker) {
      const lastTabbableElement = getLastTabbableElement(state.container);
      attemptFocus(lastTabbableElement, 'Could not focus last tabbable element', state.container);
    } else if (elementReceivingFocus === state.afterFocusTrapMarker) {
      const firstTabbableElement = getFirstTabbableElement(state.container);
      attemptFocus(firstTabbableElement, 'Could not focus first tabbable element', state.container);
    } else {
      const firstTabbableElement = getFirstTabbableElement(state.container);
      attemptFocus(
        state.lastFocusedElementInsideContainer ?? firstTabbableElement,
        'Could not re-focus previously focused element (or first tabbable element)',
        state.container
      );
    }
  }

  document.addEventListener('blur', handleBlur, { capture: true });
  document.addEventListener('focus', handleFocus, { capture: true });

  return function removeFocusBlurListeners() {
    document.removeEventListener('blur', handleBlur, { capture: true });
    document.removeEventListener('focus', handleFocus, { capture: true });
  };
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

function isTargetOutsideElement(target: EventTarget | null, element: HTMLElement) {
  return !element.contains(target as Node);
}

function getCurrentlyFocusedElement() {
  return document.activeElement;
}

function getFirstTabbableElement(container: HTMLElement) {
  const tabbableElements = tabbable(container, { includeContainer: false });
  return tabbableElements[0] as HTMLElement;
}

function getLastTabbableElement(container: HTMLElement) {
  const tabbableElements = tabbable(container, { includeContainer: false });
  return tabbableElements[tabbableElements.length - 1] as HTMLElement;
}

function isHTMLElement(element: any): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

/**
 * Attempts focusing the given element.
 * If unsuccessful, displays an error in the console and potentially focus will fall back on a provided `fallbackElement`.
 */
function attemptFocus(
  element?: FocusableTarget,
  errorMessage?: string,
  fallbackElement?: HTMLElement
) {
  const wasSuccessfullyFocused = focus(element);

  // only show warnings and run fallback:
  // - if we didn't have an element to focus
  //   (this is the case where nothing is tabbable so we need to fallback to container)
  // - if we have a real HTML element but focus didn't work for some reason
  if (element === undefined || (isHTMLElement(element) && !wasSuccessfullyFocused)) {
    if (Boolean(errorMessage)) {
      console.warn(errorMessage);
    }
    if (fallbackElement !== undefined) {
      console.info('Falling back to container focus');
      focus(fallbackElement);
    }
  }
}

/**
 * Moves focus to a given element (and select it if it is a selectable input)
 * Returns whether the focus was successfully moved to the given element
 */
function focus(element: FocusableTarget | undefined) {
  if (element && element.focus) {
    // NOTE: we prevent scrolling on focus.
    // This is so we don't cause jarring transitions for users.
    element.focus({ preventScroll: false });
    if (isSelectableInput(element)) {
      element.select();
    }
  }
  return getCurrentlyFocusedElement() === element;
}

export { createFocusTrap };
export type { FocusableTarget };
