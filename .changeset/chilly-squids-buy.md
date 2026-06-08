---
"@radix-ui/react-slot": patch
"radix-ui": patch
---

Added generic type arguments for `SlotProps` and `createSlot` to specify the type of element a slot should render, as well as its props.

```tsx
const Slot = createSlot<HTMLButtonElement, MyCustomButtonProps>('Slot');
```
