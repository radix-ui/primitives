import { Primitive as BasePrimitive, dispatchDiscreteCustomEvent } from '@radix-ui/react-primitive';
export * as Arrow from '@radix-ui/react-arrow';
export * as Collection from '@radix-ui/react-collection';
export { composeRefs, useComposedRefs } from '@radix-ui/react-compose-refs';
export * as Context from '@radix-ui/react-context';
export * as DismissableLayer from '@radix-ui/react-dismissable-layer';
export * as FocusGuards from '@radix-ui/react-focus-guards';
export * as FocusScope from '@radix-ui/react-focus-scope';
export * as Menu from '@radix-ui/react-menu';
export * as Popper from '@radix-ui/react-popper';
export * as Presence from '@radix-ui/react-presence';
export type { PrimitivePropsWithRef } from '@radix-ui/react-primitive';
export * as RovingFocus from '@radix-ui/react-roving-focus';
export { useCallbackRef } from '@radix-ui/react-use-callback-ref';
export {
  useControllableState,
  useControllableStateReducer,
} from '@radix-ui/react-use-controllable-state';
export { useEffectEvent } from '@radix-ui/react-use-effect-event';
export { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';
export { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
export { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
export { useSize } from '@radix-ui/react-use-size';
export { composeEventHandlers } from '@radix-ui/primitive';

const Primitive = BasePrimitive as typeof BasePrimitive & {
  Root: typeof BasePrimitive;
  dispatchDiscreteCustomEvent: typeof dispatchDiscreteCustomEvent;
};
Primitive.dispatchDiscreteCustomEvent = dispatchDiscreteCustomEvent;
Primitive.Root = BasePrimitive;
export { Primitive };
