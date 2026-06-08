import { Slot } from 'radix-ui';

/**
 * A demonstration `mergeProps` strategy shared by the "WithCustomMergeProps" stories across
 * components. It delegates to the default merge behavior, then tags the merged element with a
 * marker attribute and a visible dashed outline so it's obvious the custom function ran when
 * merging `Slot` / `asChild` props onto the consumer's element.
 *
 * Drop it onto a single `Slot.Root` via the `mergeProps` prop for one-off needs, or onto a
 * `Slot.Provider` to apply it to every nested Radix component that renders via `asChild`.
 */
export const customMergeProps: Slot.MergePropsFunction = (
  slotProps: Record<string, any>,
  childProps: Record<string, any>,
) => {
  const merged = Slot.mergeProps(slotProps, childProps);
  return {
    ...merged,
    'data-custom-merge': 'true',
    style: { outline: '2px dashed hotpink', outlineOffset: 2, ...merged.style },
  };
};
