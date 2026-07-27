/**
 * `createSlot` can be currently called on either the server or the client. It
 * is included as its own entrypoint without `use client` directive. If called
 * on the server, it will create a React Server Component that cannot use
 * context due to RSC constraints, so default context will always be used.
 * Internally we should never actually call it in a server component since the
 * user should expect that it would behave the same on both the server and the
 * client.
 *
 * TODO: We should add an explicit error if called in a server build.
 */

import * as React from 'react';
import type { MergePropsFunction } from './merge-props';
import { getSlottableIdentifier } from './slot-utils';
import { useSlotContext } from './slot-context';
import { useRenderSlot } from './render-slot';

declare module 'react' {
  interface ReactElement {
    $$typeof?: symbol | string;
  }
}

type SlotProps<Elem extends Element = HTMLElement, Props = React.HTMLAttributes<Elem>> = Props & {
  children?: React.ReactNode;
  mergeProps?: MergePropsFunction;
};

/* @__NO_SIDE_EFFECTS__ */ function createSlot<
  Elem extends Element = HTMLElement,
  Props = React.HTMLAttributes<Elem>,
>(ownerName: string) {
  const Slot = React.forwardRef<Elem, SlotProps<Elem, Props>>((props, forwardedRef) => {
    const context = useSlotContext();
    return useRenderSlot({
      context,
      ownerName,
      props,
      ref: forwardedRef,
    });
  });

  Slot.displayName = `${ownerName}.Slot`;
  return Slot;
}

type SlottableChildrenProps = { children: React.ReactNode };
type SlottableRenderFnProps = {
  child: React.ReactNode;
  children: (slottable: React.ReactNode) => React.ReactNode;
};

type SlottableProps = SlottableRenderFnProps | SlottableChildrenProps;
interface SlottableComponent extends React.FC<SlottableProps> {
  __radixId: symbol;
}

/* @__NO_SIDE_EFFECTS__ */ function createSlottable(ownerName: string) {
  const Slottable: SlottableComponent = (props) => {
    return 'child' in props ? props.children(props.child) : props.children;
  };

  Slottable.displayName = `${ownerName}.Slottable`;
  Slottable.__radixId = getSlottableIdentifier();
  return Slottable;
}

export { createSlot, createSlottable };
