import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import {
  createSlotError,
  createSlottableError,
  getElementRef,
  getSlottableElementFromSlottable,
  isLazyComponent,
  isSlottable,
} from './slot-utils';
import type { SlotProps, SlottableProps } from './slot-utils';
import type { SlotContextValue } from './slot-context';

const use: typeof React.use | undefined = (React as any)[' use '.trim().toString()];

export function useRenderSlot<
  Elem extends Element = HTMLElement,
  Props = React.HTMLAttributes<Elem>,
>(args: {
  //
  ownerName: string;
  ref: React.Ref<Elem>;
  context: SlotContextValue;
  props: React.PropsWithoutRef<SlotProps<Elem, Props>>;
}) {
  const { context, ownerName, props, ref: forwardedRef } = args;
  let {
    //
    mergeProps: mergePropsProp = context,
    children,
    ...slotProps
  } = props;
  let slottableElement: React.ReactElement | null = null;
  let hasSlottable = false;
  const newChildren: React.ReactNode[] = [];
  if (isLazyComponent(children) && typeof use === 'function') {
    children = use(children._payload);
  }

  React.Children.forEach(children, (maybeSlottable) => {
    if (isSlottable(maybeSlottable)) {
      hasSlottable = true;
      const slottable = maybeSlottable;
      let child = 'child' in slottable.props ? slottable.props.child : slottable.props.children;

      if (isLazyComponent(child) && typeof use === 'function') {
        child = use(child._payload);
      }

      slottableElement = getSlottableElementFromSlottable(slottable, child);
      newChildren.push((slottableElement?.props as any)?.children);
    } else {
      newChildren.push(maybeSlottable);
    }
  });

  if (slottableElement) {
    slottableElement = React.cloneElement(slottableElement, undefined, newChildren);
  } else if (
    // A `Slottable` was found but it didn't resolve to a single element (e.g.
    // it wrapped multiple elements, text, or a render-prop `child` that
    // wasn't an element). Don't fall back to treating the `Slottable` wrapper
    // itself as the slot target — throw a descriptive error below instead.
    !hasSlottable &&
    React.Children.count(children) === 1 &&
    React.isValidElement(children)
  ) {
    slottableElement = children;
  }

  const slottableElementRef = slottableElement ? getElementRef(slottableElement) : undefined;
  const composedRef = useComposedRefs(forwardedRef, slottableElementRef);

  if (!slottableElement) {
    // Empty/falsy children (`null`, `undefined`, `false`, no children, etc.)
    // are valid and render nothing. Anything else is content we couldn't slot
    // onto a single element, which is a usage error, so we fail loudly with a
    // clear message.
    if (children || children === 0) {
      throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
    }
    return children;
  }

  const mergedProps = mergePropsProp(
    slotProps,
    (slottableElement.props ?? {}) as Record<string, unknown>,
  );

  // do not pass ref to React.Fragment for React 19 compatibility
  if (slottableElement.type !== React.Fragment) {
    mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
  }

  return React.cloneElement(slottableElement, mergedProps);
}

export function useRenderSlottable(args: { props: SlottableProps }) {
  const { props } = args;
  return 'child' in props ? props.children(props.child) : props.children;
}
