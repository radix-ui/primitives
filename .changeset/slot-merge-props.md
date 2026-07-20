---
"@radix-ui/react-slot": minor
"radix-ui": minor
---

Added entrypoints to control how `Slot` merges props with its child. You can now:

1. pass a `mergeProps` function to an individual `Slot` for one-off needs, or
2. Use the new `Slot.Provider` to apply a custom merge strategy to all nested components that use `Slot` under the hood.

```tsx
import { Slot } from "radix-ui";

const mergeProps: Slot.MergePropsFunction = (slotProps, childProps) => {
  // your custom merge strategy, optionally delegating to the default
  const merged = Slot.mergeProps(slotProps, childProps);
  return {
    ...merged,
    className: classNameProcessor(slotProps, childProps),
    'data-custom-merge': 'true',
  };
};

// one-off
<Slot.Root mergeProps={mergeProps}>{child}</Slot.Root>

// applies to all nested `asChild` components
<Slot.Provider mergeProps={mergeProps}>
  <App />
</Slot.Provider>
```

**IMPORTANT:** The `mergeProps` function should be stable across renders to avoid excessive rendering of Slot components. We recommend defining it outside of the component scope.

```tsx
// good, mergeProps is stable across renders
const mergeProps = (slotProps, childProps) => {
  // ...
};
function Good() {
  return <Slot.Root mergeProps={mergeProps} />;
}

// not so good, mergeProps is recreated on every render
function LessGood() {
  return (
    <Slot.Root
      mergeProps={(slotProps, childProps) => {
        // ...
      }}
    />
  );
}
```
