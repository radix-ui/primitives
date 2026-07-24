'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';

// The consumer's custom merge strategy, provided via `Slot.Provider` on the
// client. It's defined and used entirely within this "use client" module, so
// the non-serializable function never crosses the server/client boundary.
//
// It delegates to the default `mergeProps` and then stamps a marker attribute
// so the prerendered HTML can prove the custom strategy actually ran.
const customMergeProps: Slot.MergePropsFunction = (slotProps, childProps) => ({
  ...Slot.mergeProps(slotProps, childProps),
  'data-provider-merged': 'true',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <Slot.Provider mergeProps={customMergeProps}>{children}</Slot.Provider>;
}
