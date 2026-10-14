---
"@radix-ui/react-slot": minor
"radix-ui": minor
---

Added unstable APIs to control how `Slot` merges props with its child. You can now:

1. pass a function to `unstableMergeProps` to an individual `Slot` for one-off needs, or
2. use the new `Slot.Provider` to apply a custom merge strategy to all nested components that use `Slot` under the hood.

**These APIs are unstable and may change in a minor release.**

```tsx
import { Slot } from "radix-ui";
import { unstable_mergeProps, type unstable_MergePropsFunction } from "radix-ui/slot/merge-props";

const customMergeProps: unstable_MergePropsFunction = (slotProps, childProps) => {
  // your custom merge strategy, optionally delegating to the default
  const merged = unstable_mergeProps(slotProps, childProps);
  return {
    ...merged,
    className: classNameProcessor(slotProps, childProps),
    'data-custom-merge': 'true',
  };
};

// one-off
<Slot.Root unstableMergeProps={customMergeProps}>{child}</Slot.Root>

// applies to all nested `asChild` components
<Slot.Provider unstableMergeProps={customMergeProps}>
  <App />
</Slot.Provider>
```

**IMPORTANT:** The `unstableMergeProps` function should be stable across renders to avoid excessive rendering of Slot components. We recommend defining it outside of the component scope.

```tsx
// good, customMergeProps is stable across renders
const customMergeProps = (slotProps, childProps) => {
  // ...
};
function Good() {
  return <Slot.Root unstableMergeProps={customMergeProps} />;
}

// not so good, the merge function is recreated on every render
function LessGood() {
  return (
    <Slot.Root
      unstableMergeProps={(slotProps, childProps) => {
        // ...
      }}
    />
  );
}
```
