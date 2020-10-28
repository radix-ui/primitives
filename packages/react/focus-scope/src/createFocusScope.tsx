import { tabbable } from 'tabbable';

type FocusableTarget = HTMLElement | { focus(): void };

const AUTOFOCUS_ON_CREATE = 'focusScope.autoFocusOnCreate';
const AUTOFOCUS_ON_DESTROY = 'focusScope.autoFocusOnDestroy';

/* -------------------------------------------------------------------------------------------------
 * createFocusScope
 * -----------------------------------------------------------------------------------------------*/

function createFocusScope(container: HTMLElement) {
  const PREVIOUSLY_FOCUSED_ELEMENT = getCurrentlyFocusedElement();

  // To contain focus, we create (and later inject) 2 focusable markers.
  // One is injected as the first child of the container, and the other as the last child.
  // They are used to:
  // - determine the direction the focus is attempting to leave the container.
  // - when focused, forward focus to the first/last tabbable alement as appropriate.
  const START_MARKER = createFocusScopeMarker('start');
  const END_MARKER = createFocusScopeMarker('end');

  // setup
  makeContainerFocusable(container);
  autoFocusOnCreate();

  // internal utils
  function addFocusScopeMarkers() {
    container.insertAdjacentElement('afterbegin', START_MARKER);
    container.insertAdjacentElement('beforeend', END_MARKER);
    START_MARKER.addEventListener('focus', handleStartMarkerFocus, true);
    END_MARKER.addEventListener('focus', handleEndMarkerFocus, true);
  }

  function removeFocusScopeMarkers() {
    START_MARKER.removeEventListener('focus', handleStartMarkerFocus, true);
    END_MARKER.removeEventListener('focus', handleEndMarkerFocus, true);
    START_MARKER.remove();
    END_MARKER.remove();
  }

  function autoFocusOnCreate() {
    const createEvent = new Event(AUTOFOCUS_ON_CREATE, {
      bubbles: false,
      cancelable: true,
    });
    container.dispatchEvent(createEvent);

    if (!createEvent.defaultPrevented) {
      const tabbableElements = getTabbableElements(container);
      attemptFocus(tabbableElements[0] as HTMLElement, FOCUS_ON_CREATE_ERROR, container);
    }
  }

  function autoFocusOnDestroy() {
    const destroyEvent = new Event(AUTOFOCUS_ON_DESTROY, {
      bubbles: false,
      cancelable: true,
    });
    container.dispatchEvent(destroyEvent);

    if (!destroyEvent.defaultPrevented) {
      attemptFocus(PREVIOUSLY_FOCUSED_ELEMENT, FOCUS_ON_DESTROY_ERROR);
    }
  }

  function handleStartMarkerFocus() {
    const tabbableElements = getTabbableElements(container);
    const endMarkerIndex = tabbableElements.length - 1;
    const tabbableBeforeEndMarker = tabbableElements[endMarkerIndex - 1];
    attemptFocus(
      tabbableBeforeEndMarker as HTMLElement,
      'Could not focus last tabbable element',
      container
    );
  }

  function handleEndMarkerFocus() {
    const tabbableElements = getTabbableElements(container);
    const tabbableAfterStartMarker = tabbableElements[1];
    attemptFocus(
      tabbableAfterStartMarker as HTMLElement,
      'Could not focus first tabbable element',
      container
    );
  }

  // create focus scope instance
  const focusScope = {
    trap: addFocusScopeMarkers,
    untrap: removeFocusScopeMarkers,

    destroy: () => {
      makeContainerNonFocusable(container);
      focusScope.untrap();
      autoFocusOnDestroy();
    },
  };

  return focusScope;
}

/* -------------------------------------------------------------------------------------------------
 * Utils
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
}

function makeContainerNonFocusable(container: HTMLElement) {
  container.removeAttribute('data-focus-scope-container');
  container.removeAttribute('tabIndex');
}

function getCurrentlyFocusedElement() {
  return document.activeElement as HTMLElement | null;
}

function getTabbableElements(container: HTMLElement) {
  return tabbable(container, { includeContainer: false });
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
    element.focus({ preventScroll: true });
    if (isSelectableInput(element)) {
      element.select();
    }
  }
  return getCurrentlyFocusedElement() === element;
}

const FOCUS_ON_CREATE_ERROR = `Could not move focus to an element inside the focus scope (see details below).
Your focus scope should contain at least one focusable element.`;

const FOCUS_ON_DESTROY_ERROR = `Could not return focus to an element outside the focus scope (see details below).
The element that was focused before creating the focus scope should still exists.`;

export { createFocusScope, AUTOFOCUS_ON_CREATE, AUTOFOCUS_ON_DESTROY };
export type { FocusableTarget };
