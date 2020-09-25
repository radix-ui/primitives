import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
import { createFocusScope } from './createFocusScope';

import type { FocusableTarget } from './createFocusScope';

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
  focusOnUnmount?: FocusParam;
};

const FocusScope = React.forwardRef<HTMLElement, FocusScopeProps>((props, forwardedRef) => {
  const { children, trapped = false, focusOnMount = 'none', focusOnUnmount = 'none' } = props;
  const child = React.Children.only(children);
  if (ReactIs.isFragment(child)) {
    throw new Error(
      'FocusScope needs to have a single valid React child that renders a DOM element.'
    );
  }
  const focusScopeRef = React.useRef<ReturnType<typeof createFocusScope>>();
  const containerRef = React.useRef<HTMLElement>(null);
  const ref = useComposedRefs((child as any).ref, forwardedRef, containerRef);

  // Create the focus scope on mount and destroy it on unmount
  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      focusScopeRef.current = createFocusScope({
        container,
        elementToFocusOnCreate: resolveFocusParam(focusOnMount),
        elementToFocusOnDestroy: resolveFocusParam(focusOnUnmount),
      });

      return () => focusScopeRef.current?.destroy();
    }
    // NOTE: `createFocusScope` has couple major side-effects:
    // - when created, it may move focus inside
    // - when destroyed, it may move focus back outside
    //
    // Because of this, we need to ensure we don't destroy/re-create when some config changes
    // as this would potentially run some side-effects we don't intend to.
    //
    // This is why we disable the `react-hooks/exhaustive-deps` rule and skip dependencies.
    // We can safely do so because of the following reasons:
    //
    // There are potentially 3 parameters that can change:
    //
    // - `trapped`:
    //    This is synced manually in the first `useEffect` below using imperative
    //    `trap()` and `untrap()` methods on the instance returned by `createFocusScope`.
    //
    // - `focusOnMount`:
    //    Even if this changed throughout the component's lifecycle we can safely ignore it
    //    as its intent is solely to run a side-effect after being mounted.
    //
    // - `focusOnUnmount`:
    //    This could change throughout the component's lifecycle and cannot be safely ignored
    //    because it runs a side-effect when unmounting. This is why we run a setter in the
    //    second `useEffect` below to update the configuration without side-effect.
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
    focusScopeRef.current?.setElementToFocusOnDestroy(resolveFocusParam(focusOnUnmount));
  }, [focusOnUnmount]);

  return React.cloneElement(child, { ref });
});

function resolveFocusParam(param: FocusParam) {
  if (param === 'none') return null;
  if (param === 'auto') return undefined;
  return param.current ?? null;
}

export { FocusScope };
export type { FocusScopeProps };
