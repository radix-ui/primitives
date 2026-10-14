'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { unstable_mergeProps, type unstable_MergePropsFunction } from 'radix-ui/slot/merge-props';

// The consumer's custom merge strategy, provided via `Slot.Provider` on the
// client. It's defined and used entirely within this "use client" module, so
// the non-serializable function never crosses the server/client boundary.
//
// It delegates to the default `mergeProps` and then stamps a marker attribute
// so the prerendered HTML can prove the custom strategy actually ran.
const customMergeProps: unstable_MergePropsFunction = (slotProps, childProps) => ({
  ...unstable_mergeProps(slotProps, childProps),
  'data-provider-merged': 'true',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <Slot.Provider unstableMergeProps={customMergeProps}>{children}</Slot.Provider>;
}
