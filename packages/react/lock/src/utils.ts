import { tabbable } from '@interop-ui/tabbable';
import { hideOthers } from 'aria-hidden';
import { arrayRemove } from '@interop-ui/utils';

export type FocusableTarget = HTMLElement | { focus(): void };

type FocusTrapConfig = {
  /** The element inside which we want to trap focus */
  container: HTMLElement;

  /**
   * An element to focus on inside the focus trap after it is activated.
   * (default: first focusable element inside the focus trap)
   * (fallback: first focusable element inside the focus trap, then the container itself)
   */
  elementToFocusWhenActivated?: FocusableTarget | null;

  /**
   * An element to focus on outside the focus trap after it is deactivated.
   * (default: last focused element before the focus trap was activated)
   * (fallback: none)
   */
  elementToFocusWhenDeactivated?: FocusableTarget | null;

  /** Whether pressing the escape key should deactivate the focus trap */
  shouldDeactivateOnEscape?: boolean;

  /** Escape key handler  */
  onEscape?: (event: KeyboardEvent) => void;

  /** Whether clicking outside the focus trap container should deactivate the focus trap */
  shouldDeactivateOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);

  /** Click outside handler */
  onOutsideClick?: (event: MouseEvent | TouchEvent, shouldPreventFocusControl: boolean) => void;

  /** Whether pointer events happening outside the focus trap container should be prevented */
  shouldPreventOutsideClick?: boolean;
};

type FocusTrapState = {
  /** Whether the focus trap is currently active or not */
  isActive: boolean;

  /** Whether the focus trap is currently paused or not */
  isPaused: boolean;

  /**
   * We need to remember which element was focused before the focus trap
   * was activated so we can return the focus to that element when the focus trap is deactivated.
   */
  elementFocusedBeforeActivation: HTMLElement | undefined;

  /** A marker element inserted just before the trapped container */
  beforeFocusTrapMarker: HTMLElement;

  /** A marker element inserted just after the trapped container */
  afterFocusTrapMarker: HTMLElement;
};

export type FocusTrap = {
  /** Gets whether the focus trap is currently active */
  isActive: () => boolean;

  /** Activates the focus trap */
  activate: () => void;

  /** Pauses the focus trap (not listening for events anymore) */
  pause: () => void;

  /** Resumes the focus trap */
  resume: () => void;

  /** Deactivates the focus trap */
  deactivate: (options?: DeactivateOptions) => void;

  /** Updates the config (partial) */
  updateConfig: (config: Partial<FocusTrapConfig>) => void;
};

type DeactivateOptions = {
  /**
   * Whether we should prevent the focus from being controlled on deactivation
   * (returned to `elementFocusedBeforeActivation` or `elementToFocusWhenDeactivated`).
   * It is useful to turn this on in some situations.
   * For example, when the focus trap is deactivated via click outside
   * and the element clicked is tabbable (it is fine for the focus to remain on that element in this case)
   * (default: false)
   */
  shouldPreventFocusControl?: boolean;
};

/**
 * Creates a new focus trap which can be programmatically activated/deactivated
 */
export function createFocusTrap(initialConfig: FocusTrapConfig) {
  // We keep track of the config internally as we allow dynamically updating some of it through setters
  let config: FocusTrapConfig = { ...initialConfig };

  // We keep track of some internal state
  const state: FocusTrapState = {
    isActive: false,
    isPaused: false,
    elementFocusedBeforeActivation: undefined,
    // In order to perform the focus trapping, we create (and later inject) 2 focusable marker elements.
    // One is injected just before the focus trap, and the other just after it.
    //
    // Their function is twofold:
    //
    // - when the focus escapes the focus trap, it ensures one of these will be focused with no visual feedback.
    // - they serve as markers to know which direction the user was tabbing through
    beforeFocusTrapMarker: createTrapMarkerElement('before'),
    afterFocusTrapMarker: createTrapMarkerElement('after'),
  };

  let removeEscapeListener = () => {};
  let removeOutsideClickListener = () => {};
  let stopPreventingOutsidePointerEvents = () => {};
  let stopHidingOutsideFromScreenReaders = () => {};

  const focusTrap: FocusTrap = {
    isActive: () => state.isActive,
    activate,
    deactivate,
    pause,
    resume,
    updateConfig,
  };

  return focusTrap;

  function activate() {
    if (state.isActive) return;

    state.isActive = true;
    state.isPaused = false;
    makeFocusable(config.container);
    attachFocusTrapMarkers();
    startHidingOutsideFromScreenReaders();

    focusTrapsManager.add(focusTrap);

    // We delay activation by a frame in case the focus trap was activated
    // via a `mousedown` event rather than `click` event.
    // This is because `focus` happens before `click` but after `mousedown`
    // so if we didn't delay, the element clicked wouldn't have time to focus.
    requestAnimationFrame(() => {
      performFocusOnActivation();
      addListeners();
    });
  }

  function deactivate({ shouldPreventFocusControl = false }: DeactivateOptions = {}) {
    if (!state.isActive) return;

    state.isActive = false;
    state.isPaused = false;
    makeNonFocusable(config.container);
    detachFocusTrapMarkers();
    stopHidingOutsideFromScreenReaders();
    removeListeners();

    focusTrapsManager.remove(focusTrap);

    // We delay deactivation focus by a frame in case the focus trap was deactivated
    // via a `mousedown` event rather than `click` event.
    // This is because `focus` happens before `click` but after `mousedown`
    // so if we didn't delay, the element clicked (inside the trap) would gain focus
    // after the focus trap was deactivated.
    requestAnimationFrame(() => {
      if (!shouldPreventFocusControl) {
        performFocusOnDeactivation();
      }
    });
  }

  function pause() {
    if (state.isPaused || !state.isActive) return;
    state.isPaused = true;
    removeListeners();
  }

  function resume() {
    if (!state.isPaused || !state.isActive) return;
    state.isPaused = false;
    addListeners();
  }

  function updateConfig(updatedConfig: Partial<FocusTrapConfig>) {
    function wasKeyUpdated<K extends keyof FocusTrapConfig>(key: K) {
      return key in updatedConfig && config[key] !== updatedConfig[key];
    }

    const wasShouldPreventOutsideClick = wasKeyUpdated('shouldPreventOutsideClick');

    // update config
    config = { ...config, ...updatedConfig };

    // deal with dynamic changes whilst the focus trap is currently active
    if (state.isActive) {
      if (wasShouldPreventOutsideClick) {
        if (updatedConfig.shouldPreventOutsideClick) {
          startPreventingOutsidePointerEvents();
        } else {
          stopPreventingOutsidePointerEvents();
        }
      }
    }
  }

  function performFocusOnActivation() {
    state.elementFocusedBeforeActivation = getCurrentlyFocusedElement();
    const firstTabbableElement = getFirstTabbableElement(config.container);
    const elementToFocus = config.elementToFocusWhenActivated || firstTabbableElement;
    attemptFocus(elementToFocus, ACTIVATION_FOCUS_ERROR, config.container);
  }

  function performFocusOnDeactivation() {
    const elementToFocus =
      config.elementToFocusWhenDeactivated || state.elementFocusedBeforeActivation;
    attemptFocus(elementToFocus, DEACTIVATION_FOCUS_ERROR);
  }

  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Element | null;
    // We only need to respond to a blur event if another element outisde of the popover is receiving focus.
    // https://github.com/modulz/modulz/pull/1215
    if (relatedTarget && !config.container.contains(relatedTarget)) {
      handleFocusOutside(relatedTarget);
    }
  }

  function handleFocus(event: FocusEvent) {
    if (isEventOutsideElement(event, config.container)) {
      handleFocusOutside(event.target as Element);
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
      const lastTabbableElement = getLastTabbableElement(config.container);
      attemptFocus(lastTabbableElement, 'Could not focus last tabbable element', config.container);
    } else {
      const firstTabbableElement = getFirstTabbableElement(config.container);
      attemptFocus(
        firstTabbableElement,
        'Could not focus first tabbable element',
        config.container
      );
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (config.shouldDeactivateOnEscape) {
      config.onEscape && config.onEscape(event);
    }
  }

  function handleOutsideClick(event: MouseEvent | TouchEvent) {
    // If we got here, it means the click event was technically outside the container.
    // We do an extra check for clicks within any focus trap container. This is because focus trap containers
    // are not always truly nested in the DOM (ie. when used within a Portal)
    if ((event.target as Element | null)?.closest('[data-focus-trap-container=true]')) {
      // in such case we do not want to treat this as a click outside of the focus trap.
      return;
    }

    const shouldDeactivate =
      typeof config.shouldDeactivateOnOutsideClick === 'function'
        ? config.shouldDeactivateOnOutsideClick(event)
        : Boolean(config.shouldDeactivateOnOutsideClick);

    if (shouldDeactivate) {
      // when deactivating by clicking outside, prevent normal return focus behaviour
      // (to `elementFocusedBeforeActivation` or `elementToFocusOnDeactivate`)
      // ONLY IF we are NOT preventing outside clicks (clicks are allowed to go through)
      // instead let the browser do what it needs to do (ie. focus a focusable element, etc)
      const shouldPreventFocusControl = !config.shouldPreventOutsideClick;
      config.onOutsideClick && config.onOutsideClick(event, shouldPreventFocusControl);
    } else {
      // prevent focusing the clicked element
      event.preventDefault();
    }
  }

  function startPreventingOutsidePointerEvents() {
    // make sure we always clean up if it was already preventing
    stopPreventingOutsidePointerEvents();

    // start preventing
    stopPreventingOutsidePointerEvents = preventOutsidePointerEvents(config.container);
  }

  function attachFocusTrapMarkers() {
    const parent = config.container.parentNode;
    if (parent === null) return;
    parent.insertBefore(state.beforeFocusTrapMarker, config.container);
    parent.insertBefore(state.afterFocusTrapMarker, config.container.nextSibling);
  }

  function detachFocusTrapMarkers() {
    state.beforeFocusTrapMarker.remove();
    state.afterFocusTrapMarker.remove();
  }

  function startHidingOutsideFromScreenReaders() {
    stopHidingOutsideFromScreenReaders = hideOthers(config.container);
  }

  function addListeners() {
    // `focus` and `blur` events don't bubble so we need to use the capture phase
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
    document.addEventListener('blur', handleBlur, { capture: true });
    document.addEventListener('focus', handleFocus, { capture: true });
    removeEscapeListener = onEscapeKeydown(handleEscape);
    removeOutsideClickListener = onOutsidePointerDown(config.container, handleOutsideClick);
    if (config.shouldPreventOutsideClick) {
      startPreventingOutsidePointerEvents();
    }
  }

  function removeListeners() {
    document.removeEventListener('blur', handleBlur, { capture: true });
    document.removeEventListener('focus', handleFocus, { capture: true });
    removeEscapeListener();
    removeOutsideClickListener();
    stopPreventingOutsidePointerEvents();
  }
}
// NOTE: `createFocusTrap` ends here
// Below are pure functions that don't need to close over any variables from `createFocusTrap`

function createTrapMarkerElement(position: 'before' | 'after') {
  const trapMarkerElement = document.createElement('div');
  trapMarkerElement.setAttribute('data-focus-trap-marker', position);
  trapMarkerElement.tabIndex = 0;
  return trapMarkerElement;
}

function makeFocusable(container: HTMLElement) {
  container.style.outline = 'none';
  container.tabIndex = -1;
  container.setAttribute('data-focus-trap-container', 'true');
}

function makeNonFocusable(container: HTMLElement) {
  container.style.outline = '';
  container.removeAttribute('tabIndex');
  container.removeAttribute('data-focus-trap-container');
}

function isEventOutsideElement(event: Event, element: HTMLElement) {
  return !element.contains(event.target as Node);
}

function getCurrentlyFocusedElement() {
  return document.activeElement as HTMLElement | undefined;
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
  element: FocusableTarget | undefined,
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
    // NOTE: we prevent scrolling on focus because we are not preventing overflow in our `Popover`
    // If scroll isn't prevented and the popover is partially cut-off, the browser would try to
    // get the focused element to fit in view no matter what and would just bust the layout.
    element.focus({ preventScroll: true });
    if (isSelectableInput(element)) {
      element.select();
    }
  }
  return getCurrentlyFocusedElement() === element;
}

/**
 * Sets up a keydown listener which listens for the escape key.
 * Return a function to remove the listener.
 */
function onEscapeKeydown(
  /** A function to be called when the escape key is pressed */
  callback: (event: KeyboardEvent) => void
) {
  document.addEventListener('keydown', handleKeydown, { capture: true });

  return () => {
    document.removeEventListener('keydown', handleKeydown, { capture: true });
  };

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      callback(event);
    }
  }
}

/**
 * Sets up mousedown/touchstart listeners which listens for pointer down events outside the given container.
 * Return a function to remove the listeners.
 */
function onOutsidePointerDown(
  /** The container used as a reference to check if events happen outside */
  container: HTMLElement,

  /** A function to be called when a pointer down even happens outside the given container */
  callback: (event: MouseEvent | TouchEvent) => void
) {
  document.addEventListener('mousedown', handlePointerDown, { capture: true });
  document.addEventListener('touchstart', handlePointerDown, { capture: true });

  return () => {
    document.removeEventListener('mousedown', handlePointerDown, { capture: true });
    document.removeEventListener('touchstart', handlePointerDown, { capture: true });
  };

  function handlePointerDown(event: MouseEvent | TouchEvent) {
    if (isEventOutsideElement(event, container)) {
      callback(event);
    }
  }
}

/**
 * Prevents outside pointer events.
 * Returns a function to stop preventing.
 */
function preventOutsidePointerEvents(
  /** The container used as a reference to check if events should be prevented (if they happen outside of it) */
  container: HTMLElement
) {
  const originalBodyPointerEvents = document.body.style.pointerEvents;
  const originalContainerPointerEvents = container.style.pointerEvents;

  document.body.style.pointerEvents = 'none';
  container.style.pointerEvents = 'auto';

  const stopOutsidePointerDownListener = onOutsidePointerDown(container, (event) => {
    // NOTE: We do this to prevent focus event from happening on focusable elements
    event.preventDefault();
  });

  return () => {
    document.body.style.pointerEvents = originalBodyPointerEvents;
    container.style.pointerEvents = originalContainerPointerEvents;
    stopOutsidePointerDownListener();
  };
}

const ACTIVATION_FOCUS_ERROR = `Could not focus on an element inside the focus trap when activated (see details below).

- your focus trap should contain at least one focusable element
- or a focusable element should be provided to \`elementToFocusWhenActivated\`
`;

const DEACTIVATION_FOCUS_ERROR = `Could not focus on an element outside the focus trap when deactivated (see details below).

- the element that was focused before activating the trap should still exists
- or a focusable element should be provided to \`elementToFocusWhenDeactivated\`
`;

const focusTrapsManager = createFocusTrapsManager();

function createFocusTrapsManager() {
  /** A list of focus traps in use, ordered with the current one at the front, and so on… */
  let focusTrapsInUse: FocusTrap[] = [];

  return {
    add: function (focusTrap: FocusTrap) {
      // pause the focus trap currently in use (at the front)
      const currentFocusTrap = focusTrapsInUse[0];
      if (focusTrap !== currentFocusTrap) {
        currentFocusTrap?.pause();
      }

      const isFocusTrapAlreadyInUse = focusTrapsInUse.includes(focusTrap);

      if (isFocusTrapAlreadyInUse) {
        // move the existing trap to the front
        focusTrapsInUse = arrayRemove(focusTrapsInUse, focusTrap);
        focusTrapsInUse.unshift(focusTrap);
      } else {
        focusTrapsInUse.unshift(focusTrap);
      }
    },

    remove: function (focusTrap: FocusTrap) {
      focusTrapsInUse = arrayRemove(focusTrapsInUse, focusTrap);
      focusTrapsInUse[0]?.resume();
    },
  };
}
