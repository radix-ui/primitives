import * as React from 'react';
import type { MergePropsFunction } from './merge-props';
import { mergeProps } from './merge-props';

declare module 'react' {
  interface ReactElement {
    $$typeof?: symbol | string;
  }
}

type SlotContextValue = MergePropsFunction;

/**
 * Created lazily so that importing this module never calls
 * `React.createContext` at module scope, which throws in Server Components.
 *
 * See:
 * - https://github.com/radix-ui/primitives/issues/4072
 * - https://github.com/radix-ui/themes/issues/813
 */
let slotContext: React.Context<SlotContextValue> | undefined;

function getSlotContext(): React.Context<SlotContextValue> {
  if (!slotContext) {
    slotContext = React.createContext<SlotContextValue>(mergeProps);
    slotContext.displayName = 'SlotContext';
  }
  return slotContext;
}

const IS_CLIENT_BUILD = typeof React.createContext === 'function';

/**
 * Reads the merge strategy provided by `Slot.Provider`, falling back to the
 * default `mergeProps`. On the server we skip context entirely so that `Slot`
 * can render inside a Server Component in the common `asChild` case without a
 * client boundary, while still honoring `Slot.Provider` on the client.
 */
function useSlotContext(): SlotContextValue {
  if (!IS_CLIENT_BUILD) {
    return mergeProps;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useContext(getSlotContext());
}

export { getSlotContext, useSlotContext };
export type { SlotContextValue };
