import { tabbable } from 'tabbable';

type FocusableTarget = HTMLElement | { focus(): void };

type FocusScopeState = {
  container: HTMLElement;
  startFocusScopeMarker: HTMLElement;
  endFocusScopeMarker: HTMLElement;
  previouslyFocusedElement?: HTMLElement | null;
  lastFocusedElementInsideContainer?: HTMLElement | null;
  elementToMoveFocusTo?: FocusableTarget | null;
  elementToReturnFocusTo?: FocusableTarget | null;
};

/* -------------------------------------------------------------------------------------------------
 * createFocusScope
 * -----------------------------------------------------------------------------------------------*/

function createFocusScope(container: HTMLElement) {
  // We keep track of some internal state
  const state: FocusScopeState = {
    container,
    // In order to contain focus, we create (and later inject) 2 focusable markers.
    // One is injected just before the container, and the other just after it.
    // Their function is twofold:
    // - when focus escapes the container, it ensures one of these will be the focus recipient
    // - they serve as markers to know which direction the user was tabbing through
    startFocusScopeMarker: createFocusScopeMarker('start'),
    endFocusScopeMarker: createFocusScopeMarker('end'),
  };

  // setup
  const makeContainerNonFocusable = makeContainerFocusable(state.container);
  state.previouslyFocusedElement = getCurrentlyFocusedElement();
  let freeFocus = () => {};

  // return focus scope instance
  return {
    containFocus: () => {
      const removeFocusScopeMarkers = addFocusScopeMarkers(state);
      const removeFocusBlurListeners = addFocusBlurListeners(state);
      freeFocus = () => {
        removeFocusScopeMarkers();
        removeFocusBlurListeners();
      };
      return freeFocus;
    },

    setElementToMoveFocusTo: (elementToMoveFocusTo?: FocusableTarget | null) => {
      state.elementToMoveFocusTo = elementToMoveFocusTo;
    },

    moveFocusInScope: () => {
      const firstTabbableElement = getFirstTabbableElement(state.container);
      const elementToFocus = state.elementToMoveFocusTo || firstTabbableElement;
      attemptFocus(elementToFocus, MOVE_FOCUS_ERROR, state.container);
    },

    setElementToReturnFocusTo: (elementToReturnFocusTo?: FocusableTarget | null) => {
      state.elementToReturnFocusTo = elementToReturnFocusTo;
    },

    returnFocusOutsideScope: () => {
      const elementToFocus = state.elementToReturnFocusTo || state.previouslyFocusedElement;
      attemptFocus(elementToFocus, RETURN_FOCUS_ERROR);
    },

    destroy: () => {
      makeContainerNonFocusable();
      freeFocus();
    },
  };
}

/* -------------------------------------------------------------------------------------------------
 * Major utils
 * -----------------------------------------------------------------------------------------------*/

function createFocusScopeMarker(position: 'start' | 'end') {
  const focusScopeMarkerElement = document.createElement('span');
  focusScopeMarkerElement.setAttribute('data-focus-scope-marker', position);
  focusScopeMarkerElement.tabIndex = 0;
  focusScopeMarkerElement.style.outline = 'none';
  return focusScopeMarkerElement;
}

function makeContainerFocusable(container: HTMLElement) {
  container.setAttribute('data-focus-scope-container', 'true');
  container.tabIndex = -1;

  return function makeContainerNonFocusable() {
    container.removeAttribute('data-focus-scope-container');
    container.removeAttribute('tabIndex');
  };
}

function addFocusScopeMarkers(state: FocusScopeState) {
  const { container, startFocusScopeMarker, endFocusScopeMarker } = state;
  const parent = container.parentNode;
  parent?.insertBefore(startFocusScopeMarker, container);
  parent?.insertBefore(endFocusScopeMarker, container.nextSibling);

  return function removeFocusScopeMarkers() {
    startFocusScopeMarker.remove();
    endFocusScopeMarker.remove();
  };
}

function addFocusBlurListeners(state: FocusScopeState) {
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
    // We do an extra check for focus within any focus scope container.
    // This is because focus scope containers are not always truly nested in the DOM
    // (ie. when used within a Portal)
    if (elementReceivingFocus?.closest('[data-focus-scope-container=true]')) {
      // in such case we allow manually focusing into parent locks (via click)
      return;
    }

    if (elementReceivingFocus === state.startFocusScopeMarker) {
      const lastTabbableElement = getLastTabbableElement(state.container);
      attemptFocus(lastTabbableElement, 'Could not focus last tabbable element', state.container);
    } else if (elementReceivingFocus === state.endFocusScopeMarker) {
      const firstTabbableElement = getFirstTabbableElement(state.container);
      attemptFocus(firstTabbableElement, 'Could not focus first tabbable element', state.container);
    } else {
      const firstTabbableElement = getFirstTabbableElement(state.container);
      attemptFocus(
        state.lastFocusedElementInsideContainer ?? firstTabbableElement,
        'Could not re-focus last focused element (or first tabbable element)',
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
  return document.activeElement as HTMLElement | null;
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
  element?: FocusableTarget | null,
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
function focus(element?: FocusableTarget | null) {
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

const MOVE_FOCUS_ERROR = `Could not move focus to an element inside the focus scope (see details below).

- your focus scope should contain at least one focusable element
- or a focusable element should be provided to \`elementToMoveFocusTo\`
`;

const RETURN_FOCUS_ERROR = `Could not return focus to an element outside the focus scope (see details below).

- the element that was focused before creating the focus scope should still exists
- or a focusable element should be provided to \`elementToReturnFocusTo\`
`;

export { createFocusScope };
export type { FocusableTarget };
