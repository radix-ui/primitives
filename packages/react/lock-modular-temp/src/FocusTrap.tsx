import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
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
      const elementToFocusOnUnmount = refToFocusOnUnmount?.current ?? undefined;

      focusScopeRef.current = createFocusScope({
        container,
        elementToFocusOnCreate: focusOnMount === false ? null : elementToFocusOnMount,
        elementToFocusOnDestroy: returnFocusOnUnmount === false ? null : elementToFocusOnUnmount,
      });

      return () => focusScopeRef.current?.destroy();
    }
    // NOTE: we don't care if `focusOnMount` or `refToFocusOnMount` change
    // once the component is mounted as these are side-effect to happen on mount only.
    //
    // As for `returnFocusOnUnmount` and `refToFocusOnMount`, we use a setter to update
    // the focus scope instance.
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

  // Set `elementToFocusOnDestroy` in case things changes whilst mounted
  React.useEffect(() => {
    const elementToFocusOnUnmount = refToFocusOnUnmount?.current ?? undefined;
    focusScopeRef.current?.setElementToFocusOnDestroy(
      returnFocusOnUnmount === false ? null : elementToFocusOnUnmount
    );
  }, [refToFocusOnUnmount, returnFocusOnUnmount]);

  return React.cloneElement(child, { ref });
}

export { FocusScope };
