import * as React from 'react';
import * as ReactIs from 'react-is';
import { useCallbackRef, useComposedRefs } from '@interop-ui/react-utils';
import { createFocusScope } from './createFocusTrap';

import type { FocusableTarget } from './createFocusTrap';

type FocusScopeProps = {
  children: React.ReactElement;

  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean;

  /**
   * Whether to move focus inside the `FocusScope` on mount
   * (default: false)
   */
  focusOnMount?: boolean;

  /**
   * A ref to an element to focus on inside the FocusScope after it is mounted.
   * (default: first focusable element inside the FocusScope)
   * (fallback: first focusable element inside the FocusScope, then the container itself)
   */
  refToFocusOnMount?: React.RefObject<FocusableTarget | null | undefined>;

  /**
   * Whether to return focus outside the `FocusScope` on unmount
   * (default: false)
   **/
  returnFocusOnUnmount?: boolean;

  /**
   * A ref to an element to focus on outside the FocusScope after it is unmounted.
   * (default: last focused element before the FocusScope was mounted)
   * (fallback: none)
   */
  refToFocusOnUnmount?: React.RefObject<FocusableTarget | null | undefined>;
};

function FocusScope({
  children,
  trapped = false,
  focusOnMount = false,
  refToFocusOnMount,
  returnFocusOnUnmount = false,
  refToFocusOnUnmount,
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
      const elementToFocusOnMount = refToFocusOnMount?.current ?? undefined;
      focusScopeRef.current = createFocusScope({
        container,
        elementToFocusOnEnter: focusOnMount === false ? null : elementToFocusOnMount,
      });
      return () => focusScopeRef.current?.destroy();
    }
    // NOTE: we don't care if `focusOnMount` or `refToFocusOnMount` change
    // once the component is mounted as these are side-effect to happen on mount only.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync `trapped` prop
  React.useEffect(() => {
    if (trapped) {
      focusScopeRef.current?.trap();
      return () => focusScopeRef.current?.untrap();
    }
  }, [trapped]);

  // Return focus outside scope on unmount
  const handleUnmount = useCallbackRef(() => {
    if (returnFocusOnUnmount) {
      focusScopeRef.current?.returnFocusOutsideScope(refToFocusOnUnmount?.current);
    }
  });
  React.useEffect(() => {
    return handleUnmount;
  }, [handleUnmount]);

  return React.cloneElement(child, { ref });
}

export { FocusScope };
