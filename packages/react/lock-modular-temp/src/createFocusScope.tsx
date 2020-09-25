import { tabbable } from 'tabbable';

type FocusableTarget = HTMLElement | { focus(): void };

/* -------------------------------------------------------------------------------------------------
 * createFocusScope
 * -----------------------------------------------------------------------------------------------*/

type CreateFocusScopeOptions = {
  container: HTMLElement;
  /** `null`: don't focus, `undefined`: default focus behaviour, `element` : focus that element */
  elementToFocusOnCreate?: FocusableTarget | null;
  /** `null`: don't focus, `undefined`: default focus behaviour, `element` : focus that element */
  elementToFocusOnDestroy?: FocusableTarget | null;
};

function createFocusScope({
  container,
  elementToFocusOnCreate,
  elementToFocusOnDestroy: elementToFocusOnDestroyParam,
}: CreateFocusScopeOptions) {
  const PREVIOUSLY_FOCUSED_ELEMENT = getCurrentlyFocusedElement();

  // In order to contain focus, we create (and later inject) 2 focusable markers.
  // One is injected just before the container, and the other just after it.
  // Their function is twofold:
  // - when focus escapes the container, it ensures one of these will be the focus recipient
  // - they serve as markers to know which direction the user was tabbing through
  const START_MARKER = createFocusScopeMarker('start');
  const END_MARKER = createFocusScopeMarker('end');

  // We keep track of some internal state
  let lastFocusedElementInsideContainer: HTMLElement | null = null;
  let elementToFocusOnDestroy: FocusableTarget | undefined | null = elementToFocusOnDestroyParam;

  // setup
  makeContainerFocusable(container);
  maybeFocusOnCreate();

  // internal utils
  function addFocusScopeMarkers() {
    const parent = container.parentNode;
    parent?.insertBefore(START_MARKER, container);
    parent?.insertBefore(END_MARKER, container.nextSibling);
  }

  function removeFocusScopeMarkers() {
    START_MARKER.remove();
    END_MARKER.remove();
  }

  function maybeFocusOnCreate() {
    if (elementToFocusOnCreate === null) return;
    const elementToFocus = elementToFocusOnCreate || getFirstTabbableElement(container);
    attemptFocus(elementToFocus, FOCUS_ON_CREATE_ERROR, container);
  }

  function maybeFocusOnDestroy() {
    if (elementToFocusOnDestroy === null) return;
    const elementToFocus = elementToFocusOnDestroy || PREVIOUSLY_FOCUSED_ELEMENT;
    attemptFocus(elementToFocus, FOCUS_ON_DESTROY_ERROR);
  }

  function addFocusBlurListeners() {
    document.addEventListener('blur', handleBlur, { capture: true });
    document.addEventListener('focus', handleFocus, { capture: true });
  }

  function removeFocusBlurListeners() {
    document.removeEventListener('blur', handleBlur, { capture: true });
    document.removeEventListener('focus', handleFocus, { capture: true });
  }

  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Element | null;
    // We only need to respond to a blur event if another element outside is receiving focus.
    // https://github.com/modulz/modulz/pull/1215
    if (relatedTarget && isTargetOutsideElement(relatedTarget, container)) {
      handleFocusOutside(relatedTarget);
    }
  }

  function handleFocus({ target }: FocusEvent) {
    if (isTargetOutsideElement(target, container)) {
      handleFocusOutside(target as Element);
    } else {
      lastFocusedElementInsideContainer = target as HTMLElement;
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

    if (elementReceivingFocus === START_MARKER) {
      const lastTabbableElement = getLastTabbableElement(container);
      attemptFocus(lastTabbableElement, 'Could not focus last tabbable element', container);
    } else if (elementReceivingFocus === END_MARKER) {
      const firstTabbableElement = getFirstTabbableElement(container);
      attemptFocus(firstTabbableElement, 'Could not focus first tabbable element', container);
    } else {
      const firstTabbableElement = getFirstTabbableElement(container);
      attemptFocus(
        lastFocusedElementInsideContainer ?? firstTabbableElement,
        'Could not re-focus last focused element (or first tabbable element)',
        container
      );
    }
  }

  // create focus scope instance
  const focusScope = {
    trap: () => {
      addFocusScopeMarkers();
      addFocusBlurListeners();
    },

    untrap: () => {
      removeFocusScopeMarkers();
      removeFocusBlurListeners();
    },

    setElementToFocusOnDestroy: (element?: FocusableTarget | null) => {
      elementToFocusOnDestroy = element;
    },

    destroy: () => {
      makeContainerNonFocusable(container);
      focusScope.untrap();
      maybeFocusOnDestroy();
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

const FOCUS_ON_CREATE_ERROR = `Could not move focus to an element inside the focus scope (see details below).

- your focus scope should contain at least one focusable element
- or a focusable element should be provided to \`elementToMoveFocusTo\`
`;

const FOCUS_ON_DESTROY_ERROR = `Could not return focus to an element outside the focus scope (see details below).

- the element that was focused before creating the focus scope should still exists
- or a focusable element should be provided to \`elementToReturnFocusTo\`
`;

export { createFocusScope };
export type { FocusableTarget };
