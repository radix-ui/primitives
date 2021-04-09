import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount';
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

type FocusableTarget = HTMLElement | { focus(): void };

type FocusScopeProps = {
  children: (args: {
    ref: React.RefCallback<any>;
    tabIndex: number;
    onKeyDown: React.KeyboardEventHandler;
  }) => React.ReactElement;

  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean;

  /**
   * Event handler called when auto-focusing on mount.
   * Can be prevented.
   */
  onMountAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when auto-focusing on unmount.
   * Can be prevented.
   */
  onUnmountAutoFocus?: (event: Event) => void;
};

function FocusScope(props: FocusScopeProps) {
  const { children, trapped = false } = props;
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const onMountAutoFocus = useCallbackRef(props.onMountAutoFocus);
  const onUnmountAutoFocus = useCallbackRef(props.onUnmountAutoFocus);
  const lastFocusedElementRef = React.useRef<HTMLElement | null>(null);

  const wrapped = trapped;
  const contained = trapped;

  const scopeRef = React.useRef({
    paused: false,
    pause() {
      scopeRef.current = { ...scopeRef.current, paused: true };
    },
    resume() {
      scopeRef.current = { ...scopeRef.current, paused: false };
    },
  });

  React.useEffect(() => {
    if (container) {
      focusScopesStack.add(scopeRef);
      const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement as HTMLElement | null;

      // we need to setup the listeners before we `dispatchEvent`
      container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);

      const mountEvent = new Event(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
      container.dispatchEvent(mountEvent);
      if (!mountEvent.defaultPrevented) {
        focusFirst(getTabbableCandidates(container), { select: true });
        if (document.activeElement === PREVIOUSLY_FOCUSED_ELEMENT) {
          focus(container);
        }
      }

      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);

        // We hit a react bug (fixed in v17) with focusing in unmount.
        // We need to delay the focus a little to get around it for now.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          const unmountEvent = new Event(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(PREVIOUSLY_FOCUSED_ELEMENT ?? document.body, { select: true });
          }
          // we need to remove the listener after we `dispatchEvent`
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);

          focusScopesStack.remove(scopeRef);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus]);

  // Takes care of containing focus and wrapping focus (when tabbing whilst at the edges)
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!wrapped && !contained) return;
      if (scopeRef.current.paused) return;

      if (event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const focusedElement = document.activeElement as HTMLElement | null;
        if (focusedElement) {
          const container = event.currentTarget as HTMLElement;
          const [first, last] = getTabbableEdges(container);
          if (!first || !last) {
            event.preventDefault();
          } else {
            if (event.shiftKey) {
              if (focusedElement === first) {
                if (wrapped || contained) event.preventDefault();
                if (wrapped) focus(last, { select: true });
              }
            } else {
              if (focusedElement === last) {
                if (wrapped || contained) event.preventDefault();
                if (wrapped) focus(first, { select: true });
              }
            }
          }
        }
      }
    },
    [wrapped, contained]
  );

  // Takes care of containing focus if focus is moved outside programmatically for example
  React.useEffect(() => {
    if (contained) {
      function handleFocusIn(event: FocusEvent) {
        if (scopeRef.current.paused || !container) return;
        const target = event.target as HTMLElement | null;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current);
        }
      }

      function handleFocusOut(event: FocusEvent) {
        if (scopeRef.current.paused || !container) return;
        if (!container.contains(event.relatedTarget as HTMLElement | null)) {
          focus(lastFocusedElementRef.current);
        }
      }

      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
      return () => {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
      };
    }
  }, [contained, container]);

  return children({
    ref: React.useCallback((node) => setContainer(node), []),
    tabIndex: -1,
    onKeyDown: handleKeyDown,
  });
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Attempts focusing the first element in a list of candidates.
 * Stops when focus has actually moved.
 */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}

/**
 * Returns the first and last tabbable elements inside a container.
 * NOTE: This takes into account if elements are hidden or not.
 */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container);
  const first = getFirstRealTabbable(candidates, container);
  const last = getFirstRealTabbable(candidates.reverse(), container);
  return [first, last] as const;
}

/**
 * Returns a list of potential tabbable candidates.
 * NOTE: They are considered candidates at this point, because it includes elements that are hidden.
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = createTabbableWalker(container);
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
  // we do not take into account the order of nodes with positive `tabIndex` as it is
  // considered an accessibility issue.
  return nodes;
}

/**
 * Creates a tree that contains only tabbable elements.
 * This is only a close aproximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function createTabbableWalker(container: HTMLElement) {
  return document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
}

/**
 * Returns the first "real" tabbable in a list of candidates.
 * NOTE: This takes into account if elements are hidden or not.
 */
function getFirstRealTabbable(candidates: HTMLElement[], container: HTMLElement) {
  for (const candidate of candidates) {
    // we stop checking if it's hidden at the `container` level (excluding)
    if (!isHidden(candidate, { upTo: container })) return candidate;
  }
}

function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true;
  while (node) {
    // we stop at `upTo` (excluding it)
    if (upTo !== undefined && node === upTo) return false;
    if (getComputedStyle(node).display === 'none') return true;
    node = node.parentElement as HTMLElement;
  }
  return false;
}

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

function focus(element?: FocusableTarget | null, { select = false } = {}) {
  // only focus if that element is focusable and not already focused
  if (element && element.focus && element !== document.activeElement) {
    // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
    element.focus({ preventScroll: true });
    if (select && isSelectableInput(element)) element.select();
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

type FocusScope = { paused: boolean; pause(): void; resume(): void };
const focusScopesStack = createFocusScopesStack();

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: React.RefObject<FocusScope>[] = [];

  return {
    add(focusScopeRef: React.RefObject<FocusScope>) {
      // pause the currently active focus scope (at the top of the stack)
      const activeFocusScopeRef = stack[0];
      if (focusScopeRef !== activeFocusScopeRef) {
        activeFocusScopeRef?.current?.pause();
      }
      // remove in case it already exists (because we'll re-add it at the top of the stack)
      stack = arrayRemove(stack, focusScopeRef);
      stack.unshift(focusScopeRef);
    },

    remove(focusScopeRef: React.RefObject<FocusScope>) {
      stack = arrayRemove(stack, focusScopeRef);
      stack[0]?.current?.resume();
    },
  };
}

function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}

const Root = FocusScope;

export {
  FocusScope,
  //
  Root,
};
