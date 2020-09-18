import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusScope } from './createFocusTrap';

import type { FocusableTarget } from './createFocusTrap';

type FocusScopeProps = {
  children: React.ReactElement;

  /** Whether focus should be contained within the FocusScope */
  contain?: boolean;

  /** Whether to move focus inside the `FocusScope` on mount */
  moveFocusOnMount?: boolean;

  /**
   * A ref to an element to focus on inside the FocusScope after it is mounted.
   * (default: first focusable element inside the FocusScope)
   * (fallback: first focusable element inside the FocusScope, then the container itself)
   */
  refToMoveFocusTo?: React.RefObject<FocusableTarget | null | undefined>;

  /** Whether to return focus outside the `FocusScope` on unmount */
  returnFocusOnUnmount?: boolean;

  /**
   * A ref to an element to focus on outside the FocusScope after it is unmounted.
   * (default: last focused element before the FocusScope was mounted)
   * (fallback: none)
   */
  refToReturnFocusTo?: React.RefObject<FocusableTarget | null | undefined>;
};

function FocusScope({
  children,
  contain,
  moveFocusOnMount,
  refToMoveFocusTo,
  returnFocusOnUnmount,
  refToReturnFocusTo,
}: FocusScopeProps) {
  const child = React.Children.only(children);
  if (ReactIs.isFragment(child)) {
    throw new Error(
      'FocusScope needs to have a single valid React child that renders a DOM element.'
    );
  }
  const focusScopeRef = React.useRef<ReturnType<typeof createFocusScope>>();
  const containerRef = React.useRef<HTMLElement>(null);
  const ref = useComposedRefs((child as any).ref, containerRef);

  // Create the focus scope on mount and destroy it on unmount
  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      focusScopeRef.current = createFocusScope(container);
      return () => focusScopeRef.current?.destroy();
    }
  }, []);

  // Sync `contain` prop
  React.useEffect(() => {
    if (contain) return focusScopeRef.current?.containFocus();
  }, [contain]);

  // Sync `refToMoveFocusTo` without side-effects
  React.useEffect(() => {
    focusScopeRef.current?.setElementToMoveFocusTo(refToMoveFocusTo?.current);
  }, [refToMoveFocusTo]);

  // Move focus in scope on mount
  React.useEffect(() => {
    if (moveFocusOnMount) {
      focusScopeRef.current?.moveFocusInScope();
    }
  }, [moveFocusOnMount]);

  // Sync `refToReturnFocusTo` without side-effects
  React.useEffect(() => {
    focusScopeRef.current?.setElementToReturnFocusTo(refToReturnFocusTo?.current);
  }, [refToReturnFocusTo]);

  // Return focus outside scope on unmount
  React.useEffect(() => {
    return () => {
      if (returnFocusOnUnmount) {
        focusScopeRef.current?.returnFocusOutsideScope();
      }
    };
  }, [returnFocusOnUnmount]);

  return React.cloneElement(child, { ref });
}

export { FocusScope };
