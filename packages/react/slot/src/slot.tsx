'use client';
import * as React from 'react';
import type { AnyProps, MergePropsFunction } from './merge-props';
import { useRenderSlot, useRenderSlottable } from './render-slot';
import { getSlottableIdentifier } from './slot-utils';
import { getSlotContext, useSlotContext } from './slot-context';

/* -------------------------------------------------------------------------------------------------
 * SlotProvider
 * -----------------------------------------------------------------------------------------------*/

interface SlotProviderProps {
  children: React.ReactNode;
  mergeProps: MergePropsFunction<AnyProps, AnyProps, AnyProps>;
}

const SlotProvider: React.FC<SlotProviderProps> = ({ children, mergeProps }) => {
  const SlotContext = getSlotContext();
  return <SlotContext.Provider value={mergeProps}>{children}</SlotContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

export type Usable<T> = PromiseLike<T> | React.Context<T>;

type SlotProps<Elem extends Element = HTMLElement, Props = React.HTMLAttributes<Elem>> = Props & {
  children?: React.ReactNode;
  mergeProps?: MergePropsFunction;
};

const Slot = /* @__PURE__ */ React.forwardRef<
  HTMLElement,
  SlotProps<HTMLElement, React.HTMLAttributes<HTMLElement>>
>(function Slot(props, forwardedRef) {
  const context = useSlotContext();
  return useRenderSlot({
    context,
    ownerName: 'Slot',
    props,
    ref: forwardedRef,
  });
});

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

type SlottableChildrenProps = { children: React.ReactNode };
type SlottableRenderFnProps = {
  child: React.ReactNode;
  children: (slottable: React.ReactNode) => React.ReactNode;
};

type SlottableProps = SlottableRenderFnProps | SlottableChildrenProps;
interface SlottableComponent extends React.FC<SlottableProps> {
  __radixId: symbol;
}

const Slottable: SlottableComponent = /* @__PURE__ */ function Slottable(props) {
  return useRenderSlottable({ props });
};
Slottable.__radixId = getSlottableIdentifier();

export {
  Slot,
  Slottable,
  SlotProvider,
  //
  Slot as Root,
  SlotProvider as Provider,
};
export type { SlotProviderProps, SlotProps, SlottableProps };
