import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusScope } from './createFocusTrap';

import type { FocusableTarget } from './createFocusTrap';

type FocusParam = 'none' | 'auto' | React.RefObject<FocusableTarget | null | undefined>;

type FocusScopeProps = {
  children: React.ReactElement;

  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean;

  /**
   * Whether to move focus inside the `FocusScope` on mount
   * - `'none'`: Do not focus
   * - `'auto'`: first focusable element inside the FocusScope, if none the container itself
   * - `ref`: Focus that element
   *
   * (default: `'none'`)
   */
  focusOnMount?: FocusParam;

  /**
   * Whether to return focus outside the `FocusScope` on unmount
   * - `'none'`: Do not focus
   * - `'auto'`: last focused element before the FocusScope was mounted
   * - `ref`: Focus that element
   *
   * (default: `'none'`)
   **/
  returnFocusOnUnmount?: FocusParam;
};

function FocusScope({
  children,
  trapped = false,
  focusOnMount = 'none',
  returnFocusOnUnmount = 'none',
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
      focusScopeRef.current = createFocusScope({
        container,
        elementToFocusOnCreate: resolveFocusParam(focusOnMount),
        elementToFocusOnDestroy: resolveFocusParam(returnFocusOnUnmount),
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
    focusScopeRef.current?.setElementToFocusOnDestroy(resolveFocusParam(returnFocusOnUnmount));
  }, [returnFocusOnUnmount]);

  return React.cloneElement(child, { ref });
}

function resolveFocusParam(param: FocusParam) {
  if (param === 'none') return null;
  if (param === 'auto') return undefined;
  return param.current ?? null;
}

export { FocusScope };
export type { FocusScopeProps };
