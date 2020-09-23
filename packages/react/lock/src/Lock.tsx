import * as React from 'react';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusTrap, FocusableTarget, FocusTrap } from './utils';
import { useDebugContext } from '@interop-ui/react-debug-context';

type LockContextValue = {
  containerRef: React.RefObject<HTMLElement>;
  deactivateParentLocks?: (shouldPreventFocusControl: boolean) => void;
  shouldDeactivateOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);
};

const LockContext = React.createContext({} as LockContextValue);
LockContext.displayName = 'LockContext';

type LockProps = {
  children: React.ReactNode;

  /**
   * A function called when the Lock is deactivated from the inside (escape / outslide click)
   */
  onDeactivate?: () => void;

  /**
   * A ref to an element to focus on inside the Lock after it is activated.
   * (default: first focusable element inside the Lock)
   * (fallback: first focusable element inside the Lock, then the container itself)
   */
  refToFocusOnActivation?: React.RefObject<FocusableTarget | null | undefined>;

  /**
   * A ref to an element to focus on outside the Lock after it is deactivated.
   * (default: last focused element before the Lock was activated)
   * (fallback: none)
   */
  refToFocusOnDeactivation?: React.RefObject<FocusableTarget | null | undefined>;

  /** Whether pressing the escape key should deactivate the Lock */
  shouldDeactivateOnEscape?: boolean;

  /** Whether clicking outside the locked container should deactivate the Lock */
  shouldDeactivateOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);

  /** Whether pointer events happening outside the locked container should be prevented */
  shouldPreventOutsideClick?: boolean;
};

function Lock({ children, ...props }: LockProps) {
  const debugContext = useDebugContext();
  const child = React.Children.only(children);
  if (!React.isValidElement(child)) return null;
  return debugContext.disableLock ? child : <LockImpl {...props}>{child}</LockImpl>;
}

type LockImplProps = Omit<LockProps, 'children'> & {
  children: React.ReactElement & { ref?: React.Ref<HTMLElement> };
};

function LockImpl({
  children: child,
  onDeactivate = () => {},
  refToFocusOnActivation,
  refToFocusOnDeactivation,
  shouldDeactivateOnEscape = true,
  shouldDeactivateOnOutsideClick = true,
  shouldPreventOutsideClick = true,
}: LockImplProps) {
  /**
   * A ref to set on the container element in which we want to trap focus.
   *
   * NOTE: we do not support the case where that container would dynamically change.
   */
  const containerRef = React.useRef<HTMLElement>(null);

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
      focusTrapRef.current.activate();
    }

    return () => {
      focusTrapRef.current?.deactivate({
        shouldPreventFocusControl: shouldPreventFocusControlWhenDeactivatedRef.current,
      });
      // reset
      shouldPreventFocusControlWhenDeactivatedRef.current = false;
    };
  }, []);

  const onOutsideClickHandler = React.useCallback(
    (event: MouseEvent | TouchEvent, shouldPreventFocusControl: boolean) => {
      // NOTE: make sure we update the ref before calling `onDeactivate` so it's setup on time
      shouldPreventFocusControlWhenDeactivatedRef.current = shouldPreventFocusControl;
      onDeactivate();

      // kick-off deactivating all the parent Locks only if top-level lock isn't preventing clicks
      if (!shouldPreventOutsideClick) {
        if (deactivateParentLocksFromContext) {
          deactivateParentLocksFromContext(shouldPreventFocusControl);
        }
      }
    },
    [onDeactivate, shouldPreventOutsideClick, deactivateParentLocksFromContext]
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
      shouldPreventOutsideClick,
    });
  }, [
    refToFocusOnActivation,
    refToFocusOnDeactivation,
    shouldDeactivateOnEscape,
    onDeactivate,
    shouldDeactivateOnOutsideClick,
    shouldDeactivateOnOutsideClickFromContext,
    onOutsideClickHandler,
    shouldPreventOutsideClick,
  ]);

  const composedContainerRef = useComposedRefs(child.ref, containerRef);

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
      {
        // finally, clone our container, attaching the composed ref to it
        React.cloneElement(child, { ref: composedContainerRef })
      }
    </LockContext.Provider>
  );
}

function useLockContext() {
  const { containerRef } = React.useContext(LockContext);
  return React.useMemo(() => ({ lockContainerRef: containerRef }), [containerRef]);
}

export { useLockContext, Lock };
export type { LockProps };
