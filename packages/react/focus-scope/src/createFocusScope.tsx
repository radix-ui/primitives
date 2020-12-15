import { arrayRemove } from '@radix-ui/utils';

type FocusableTarget = HTMLElement | { focus(): void };

const AUTOFOCUS_ON_CREATE = 'focusScope.autoFocusOnCreate';
const AUTOFOCUS_ON_DESTROY = 'focusScope.autoFocusOnDestroy';

/* -------------------------------------------------------------------------------------------------
 * createFocusScope
 * -----------------------------------------------------------------------------------------------*/

function createFocusScope(container: HTMLElement) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement as HTMLElement | null;

  function autoFocusOnCreate() {
    const createEvent = new Event(AUTOFOCUS_ON_CREATE, { bubbles: false, cancelable: true });
    container.dispatchEvent(createEvent);
    if (createEvent.defaultPrevented) return;
    trapFocus(container, null);
  }

  function autoFocusOnDestroy() {
    const destroyEvent = new Event(AUTOFOCUS_ON_DESTROY, { bubbles: false, cancelable: true });
    container.dispatchEvent(destroyEvent);
    if (destroyEvent.defaultPrevented) return;
    focus(PREVIOUSLY_FOCUSED_ELEMENT);
  }

  function addListeners() {
    document.addEventListener('focusout', handleFocusInOrFocusOut, { capture: true });
    document.addEventListener('focusin', handleFocusInOrFocusOut, { capture: true });
  }

  function removeListeners() {
    document.removeEventListener('focusout', handleFocusInOrFocusOut, { capture: true });
    document.removeEventListener('focusin', handleFocusInOrFocusOut, { capture: true });
  }

  function handleFocusInOrFocusOut(event: FocusEvent) {
    if (focusScope.paused) return;

    const isFocusOut = event.type === 'focusout';
    const focusedTarget = (isFocusOut ? event.relatedTarget : event.target) as Element | null;
    if (!container.contains(focusedTarget)) {
      // we're intercepting the event and will re-focus in
      // so we also pretend that the event didn't happen by stopping propagation.
      event.stopImmediatePropagation();
      trapFocus(container, focusedTarget);
    }
  }

  // create focus scope instance
  const focusScope = {
    // A focus scope may be paused because another one was created.
    // This makes sense because documents are only capable of having one `activeElement` at at time.
    paused: false,
    pause: () => (focusScope.paused = true),
    resume: () => (focusScope.paused = false),
    trap: addListeners,
    untrap: removeListeners,
    destroy: () => {
      makeContainerNonFocusable(container);
      focusScope.untrap();
      autoFocusOnDestroy();
      focusScopesStack.remove(focusScope);
    },
  };

  focusScopesStack.add(focusScope);
  makeContainerFocusable(container);
  autoFocusOnCreate();

  return focusScope;
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

function makeContainerFocusable(container: HTMLElement) {
  // TODO: do better on this, should be brought to React-level probably
  if (container.tabIndex > -1) return;
  container.tabIndex = -1;
}

function makeContainerNonFocusable(container: HTMLElement) {
  container.removeAttribute('tabIndex');
}

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

/**
 * Creates a tree that contains only focusable elements, which can be traversed with
 * traditional DOM methods like `firstChild`, `lastChild`, `nextSibling`, `parentNode`, etc.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function createFocusableWalker(container: HTMLElement) {
  return document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: HTMLElement) =>
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      node.tabIndex >= 0 && !(node as any).disabled
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
}

/**
 * Effectively traps focus within a container.
 * This is done based on the DOM position of the newly focused target.
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L20
 */
function trapFocus(container: HTMLElement, focusedTarget: Element | null) {
  const focusableWalker = createFocusableWalker(container);
  const position = focusedTarget
    ? focusedTarget.compareDocumentPosition(container)
    : Node.DOCUMENT_POSITION_PRECEDING;

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    focus((focusableWalker.firstChild() as HTMLElement | null) ?? container);
  } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    focus((focusableWalker.lastChild() as HTMLElement | null) ?? container);
  }
}

function focus(element?: FocusableTarget | null) {
  if (element && element.focus) {
    // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
    element.focus({ preventScroll: true });
    if (isSelectableInput(element)) {
      element.select();
    }
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

type FocusScope = ReturnType<typeof createFocusScope>;
const focusScopesStack = createFocusScopesStack();

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: FocusScope[] = [];

  return {
    add(focusScope: FocusScope) {
      // pause the currently active focus scope (at the top of the stack)
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      // remove in case it already exists (because we'll re-add it at the top of the stack)
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },

    remove(focusScope: FocusScope) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    },

    size() {
      return stack.length;
    },
  };
}

export { createFocusScope, AUTOFOCUS_ON_CREATE, AUTOFOCUS_ON_DESTROY };
export type { FocusableTarget };
