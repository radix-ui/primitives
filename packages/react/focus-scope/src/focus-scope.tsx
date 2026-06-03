import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Primitive } from '@radix-ui/react-primitive';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount';
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

type FocusableTarget = HTMLElement | { focus(): void };

/* -------------------------------------------------------------------------------------------------
 * FocusScope
 * -----------------------------------------------------------------------------------------------*/

const FOCUS_SCOPE_NAME = 'FocusScope';

type FocusScopeElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface FocusScopeProps extends PrimitiveDivProps {
  /**
   * When `true`, tabbing from last item will focus first tabbable
   * and shift+tab from first item will focus last tababble.
   * @defaultValue false
   */
  loop?: boolean;

  /**
   * When `true`, focus cannot escape the focus scope via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapped?: boolean;

  /**
   * A list of nodes that should be treated as part of the focus scope even
   * though they don't live within the scope's DOM subtree (eg. portalled
   * content of a nested, non-modal layer). When the scope is `trapped`, focus
   * is allowed to move into these branches without being reclaimed.
   *
   * See: https://github.com/radix-ui/primitives/issues/3423
   */
  branches?: HTMLElement[];

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
}

const FocusScope = React.forwardRef<FocusScopeElement, FocusScopeProps>((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    branches,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const lastFocusedElementRef = React.useRef<HTMLElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));

  // Keep the latest branches in a ref so the trap effect below doesn't need to resubscribe its
  // listeners whenever the branch list updates. We sync it in the commit phase (not during render)
  // to stay safe under concurrent rendering, where a render can be discarded or replayed. The trap's
  // focus event handlers only run in response to user interaction (well after commit), so reading
  // the ref from them always sees the committed branch list.
  const branchesRef = React.useRef(branches);
  React.useEffect(() => {
    branchesRef.current = branches;
  });
  const isTargetInScope = React.useCallback(
    (target: HTMLElement | null) => {
      if (!target) return false;
      if (container?.contains(target)) return true;
      return Boolean(branchesRef.current?.some((branch) => branch.contains(target)));
    },
    [container],
  );

  const focusScope = React.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

  // Takes care of trapping focus if focus is moved outside programmatically for example
  React.useEffect(() => {
    if (trapped) {
      function handleFocusIn(event: FocusEvent) {
        if (focusScope.paused || !container) return;
        const target = event.target as HTMLElement | null;
        if (isTargetInScope(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }

      function handleFocusOut(event: FocusEvent) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget as HTMLElement | null;

        // A `focusout` event with a `null` `relatedTarget` will happen in at least two cases:
        //
        // 1. When the user switches app/tabs/windows/the browser itself loses focus.
        // 2. In Google Chrome, when the focused element is removed from the DOM.
        //
        // We let the browser do its thing here because:
        //
        // 1. The browser already keeps a memory of what's focused for when the page gets refocused.
        // 2. In Google Chrome, if we try to focus the deleted focused element (as per below), it
        //    throws the CPU to 100%, so we avoid doing anything for this reason here too.
        if (relatedTarget === null) return;

        // If the focus has moved to an actual legitimate element (`relatedTarget !== null`)
        // that is outside the container (and any registered branches), we move focus to the last
        // valid focused element inside.
        if (!isTargetInScope(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }

      // When the focused element gets removed from the DOM, browsers move focus
      // back to the document.body. In this case, we move focus to the container
      // to keep focus trapped correctly.
      function handleMutations(mutations: MutationRecord[]) {
        const focusedElement = document.activeElement as HTMLElement | null;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      }

      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
      const mutationObserver = new MutationObserver(handleMutations);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });

      return () => {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused, isTargetInScope]);

  React.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement as HTMLElement | null;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }

      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);

        // We hit a react bug (fixed in v17) with focusing in unmount.
        // We need to delay the focus a little to get around it for now.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          // we need to remove the listener after we `dispatchEvent`
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);

          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);

  // Takes care of looping focus (when tabbing whilst at the edges)
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;

      const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement as HTMLElement | null;

      if (isTabKey && focusedElement) {
        const container = event.currentTarget as HTMLElement;
        const [first, last] = getTabbableEdges(container);
        const hasTabbableElementsInside = first && last;

        // we can only wrap focus if we have tabbable edges
        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused],
  );

  return (
    <Primitive.div tabIndex={-1} {...scopeProps} ref={composedRefs} onKeyDown={handleKeyDown} />
  );
});

FocusScope.displayName = FOCUS_SCOPE_NAME;

/* -------------------------------------------------------------------------------------------------
 * FocusScope branch registry
 * -----------------------------------------------------------------------------------------------*/

/**
 * Lets portalled content that is a React descendant of a (modal) layer — but rendered outside of
 * that layer's DOM subtree — register itself as a "branch" of the layer's focus scope.
 *
 * A modal container (eg. `Dialog`) creates a registry via `useFocusScopeBranchRegistry`, renders a
 * `FocusScopeBranchProvider` around its children, and passes the collected `nodes` to its trapped
 * `FocusScope` (so focus isn't reclaimed from the branch) and, if applicable, to its `RemoveScroll`
 * `shards` (so the branch remains scrollable). Nested layers (eg. a non-modal `Popover`) register
 * their content node with `useFocusScopeBranch`.
 *
 * See: https://github.com/radix-ui/primitives/issues/3423
 */
interface FocusScopeBranchRegistry {
  add: (node: HTMLElement) => void;
  remove: (node: HTMLElement) => void;
}

const FocusScopeBranchContext = React.createContext<FocusScopeBranchRegistry | null>(null);

const FocusScopeBranchProvider = FocusScopeBranchContext.Provider;

function useFocusScopeBranchRegistry() {
  const [nodes, setNodes] = React.useState<HTMLElement[]>([]);
  const registry = React.useMemo<FocusScopeBranchRegistry>(
    () => ({
      add: (node) => setNodes((prev) => (prev.includes(node) ? prev : [...prev, node])),
      remove: (node) => setNodes((prev) => prev.filter((current) => current !== node)),
    }),
    [],
  );
  return { nodes, registry } as const;
}

/**
 * Registers `node` as a branch of the nearest ancestor `FocusScopeBranchProvider`. No-ops when
 * there is no ancestor registry (eg. the layer isn't nested inside a modal layer).
 */
function useFocusScopeBranch(node: HTMLElement | null) {
  const registry = React.useContext(FocusScopeBranchContext);
  React.useEffect(() => {
    if (!node || !registry) return;
    registry.add(node);
    return () => registry.remove(node);
  }, [node, registry]);
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Attempts focusing the first element in a list of candidates.
 * Stops when focus has actually moved.
 */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}

/**
 * Returns the first and last tabbable elements inside a container.
 */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last] as const;
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes;
}

/**
 * Returns the first visible element in a list.
 * NOTE: Only checks visibility up to the `container`.
 */
function findVisible(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    // we stop checking if it's hidden at the `container` level (excluding)
    if (!isHidden(element, { upTo: container })) return element;
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
  // only focus if that element is focusable
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
    element.focus({ preventScroll: true });
    // only select if its not the same element, it supports selection and we need to select
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

type FocusScopeAPI = { paused: boolean; pause(): void; resume(): void };
const focusScopesStack = createFocusScopesStack();

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: FocusScopeAPI[] = [];

  return {
    add(focusScope: FocusScopeAPI) {
      // pause the currently active focus scope (at the top of the stack)
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      // remove in case it already exists (because we'll re-add it at the top of the stack)
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },

    remove(focusScope: FocusScopeAPI) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
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

function removeLinks(items: HTMLElement[]) {
  return items.filter((item) => item.tagName !== 'A');
}

const Root = FocusScope;

export {
  FocusScope,
  FocusScopeBranchProvider,
  useFocusScopeBranchRegistry,
  useFocusScopeBranch,
  //
  Root,
};
export type { FocusScopeProps, FocusScopeBranchRegistry };
