import * as React from 'react';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusTrap, FocusTrap } from './utils';

interface LockContextValue {
  containerRef: React.RefObject<null | HTMLElement>;
  deactivateParentLocks?: (shouldPreventFocusControl: boolean) => void;
  shouldDeactivateOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);
}

const LockContext = React.createContext({} as LockContextValue);
LockContext.displayName = 'LockContext';

type LockProps = {
  children: React.ReactNode | ((ref: React.RefObject<HTMLElement | undefined>) => React.ReactNode);

  /**
   * Whether the Lock is currently active
   * (defaut: false)
   */
  isActive?: boolean;

  /**
   * A function called when the Lock is deactivated from the inside (escape / outslide click)
   */
  onDeactivate?(): void;

  /**
   * A ref to an element to focus on inside the Lock after it is activated.
   * (default: first focusable element inside the Lock)
   * (fallback: first focusable element inside the Lock, then the container itself)
   */
  refToFocusOnActivation?: React.RefObject<HTMLElement | null | undefined>;

  /**
   * A ref to an element to focus on outside the Lock after it is deactivated.
   * (default: last focused element before the Lock was activated)
   * (fallback: none)
   */
  refToFocusOnDeactivation?: React.RefObject<HTMLElement | null | undefined>;

  /** Whether pressing the escape key should deactivate the Lock */
  shouldDeactivateOnEscape?: boolean;

  /** Whether clicking outside the locked container should deactivate the Lock */
  shouldDeactivateOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);

  /** Whether pointer events happening outside the locked container should be blocked */
  shouldBlockOutsideClick: boolean;
};

function Lock({
  children,
  isActive = false,
  onDeactivate = () => {},
  refToFocusOnActivation,
  refToFocusOnDeactivation,
  shouldDeactivateOnEscape,
  shouldDeactivateOnOutsideClick,
  shouldBlockOutsideClick,
}: LockProps) {
  /**
   * A ref to set on the container element in which we want to trap focus.
   *
   * NOTE: we do not support the case where that container would dynamically change.
   */
  const containerRef = React.useRef<HTMLElement | null>(null);

  /** A ref to the focus trap  */
  const focusTrapRef = React.useRef<FocusTrap>();

  // keep track of whether we need to prevent the focus control when the focus trap is deactivated
  const shouldPreventFocusControlWhenDeactivatedRef = React.useRef(false);

  // grab the previous function that deactivates all locks which are parents to this one
  const {
    deactivateParentLocks: deactivateParentLocksFromContext,
    shouldDeactivateOnOutsideClick: shouldDeactivateOnOutsideClickFromContext,
  } = React.useContext(LockContext);

  // build up a new function to deactivate all locks to pass down to the eventual children locks
  // (through context)
  const deactivateThisLockAndItsParents = React.useCallback(
    (shouldPreventFocusControl: boolean) => {
      const hasParentLock = deactivateParentLocksFromContext !== undefined;
      // NOTE: make sure we update the ref before calling `onDeactivate` so it's setup on time for
      // when the deactivation actually happens in each Lock (where
      // `shouldPreventFocusControlWhenDeactivatedRef` is read)
      shouldPreventFocusControlWhenDeactivatedRef.current = hasParentLock
        ? true // prevent focus control for intermediary locks in a stack of locks
        : shouldPreventFocusControl;

      // deactivate this lock
      onDeactivate();

      // deactivate its parents
      if (deactivateParentLocksFromContext) {
        deactivateParentLocksFromContext(shouldPreventFocusControl);
      }
    },
    [onDeactivate, deactivateParentLocksFromContext]
  );

  // Create the focus trap on mount
  // Deactivate it on unmount
  React.useEffect(() => {
    if (containerRef.current) {
      focusTrapRef.current = createFocusTrap({
        container: containerRef.current,
        // NOTE: we do not provide any of the config that can dynamically change here as we will
        // sync those changes in an effect (see below). This is because we want to avoid having to
        // deactivate and create a new trap if an option changes so instead we manually sync these
        // changes in their own effect via a setter on the focus trap instance.
      });
    }

    return () => {
      focusTrapRef.current?.deactivate({
        shouldPreventFocusControl: shouldPreventFocusControlWhenDeactivatedRef.current,
      });
      // reset
      shouldPreventFocusControlWhenDeactivatedRef.current = false;
    };
  }, []);

  // Synchronize changes to `isActive`
  React.useEffect(() => {
    if (isActive) {
      focusTrapRef.current?.activate();
    } else {
      focusTrapRef.current?.deactivate({
        shouldPreventFocusControl: shouldPreventFocusControlWhenDeactivatedRef.current,
      });
      // reset
      shouldPreventFocusControlWhenDeactivatedRef.current = false;
    }
  }, [isActive]);

  const onOutsideClickHandler = React.useCallback(
    (event: MouseEvent | TouchEvent, shouldPreventFocusControl: boolean) => {
      // NOTE: make sure we update the ref before calling `onDeactivate` so it's setup on time
      shouldPreventFocusControlWhenDeactivatedRef.current = shouldPreventFocusControl;
      onDeactivate();

      // kick-off deactivating all the parent Locks only if top-level lock isn't blocking clicks
      if (!shouldBlockOutsideClick) {
        if (deactivateParentLocksFromContext) {
          deactivateParentLocksFromContext(shouldPreventFocusControl);
        }
      }
    },
    [onDeactivate, shouldBlockOutsideClick, deactivateParentLocksFromContext]
  );

  // Synchronise config changes
  React.useEffect(() => {
    focusTrapRef.current?.updateConfig({
      elementToFocusWhenActivated: refToFocusOnActivation?.current,
      elementToFocusWhenDeactivated: refToFocusOnDeactivation?.current,
      shouldDeactivateOnEscape,
      onEscape: onDeactivate,
      shouldDeactivateOnOutsideClick:
        // prioritize the configuration coming from the parent Lock over the prop
        shouldDeactivateOnOutsideClickFromContext ?? shouldDeactivateOnOutsideClick,
      onOutsideClick: onOutsideClickHandler,
      shouldBlockOutsideClick,
    });
  }, [
    refToFocusOnActivation,
    refToFocusOnDeactivation,
    shouldDeactivateOnEscape,
    onDeactivate,
    shouldDeactivateOnOutsideClick,
    shouldDeactivateOnOutsideClickFromContext,
    onOutsideClickHandler,
    shouldBlockOutsideClick,
  ]);

  let child = typeof children === 'function' ? null : React.Children.only(children);
  let ref = useComposedRefs(child ? (child as any).ref : null, containerRef);

  let content: React.ReactNode;

  if (typeof children === 'function') {
    // useful for cases when we need to attach the container ref to a specific element
    // other than the first child node (used in Popover for example)
    content = children(containerRef);
  } else {
    content = React.cloneElement(child as React.ReactElement, {
      // compose all the possible refs to the container element
      ref,
    });
  }

  // finally, clone our container, attaching the composed ref to it
  return (
    <LockContext.Provider
      value={{
        containerRef,
        deactivateParentLocks: deactivateThisLockAndItsParents,
        shouldDeactivateOnOutsideClick:
          // ensure the configuration passed to each child is the one from the top-most parent Lock
          shouldDeactivateOnOutsideClickFromContext ?? shouldDeactivateOnOutsideClick,
      }}
    >
      {content}
    </LockContext.Provider>
  );
}

function useLockContext() {
  let { containerRef } = React.useContext(LockContext);
  return React.useMemo(
    () => ({
      lockContainerRef: containerRef,
    }),
    [containerRef]
  );
}

export { useLockContext, Lock };
export type { LockProps };
