---
"@radix-ui/react-slot": minor
"radix-ui": minor
---

Added generic type arguments for `SlotProps` and `createSlot` to specify the type of element a slot should render, as well as its props.

```tsx
const Slot = createSlot<HTMLButtonElement, MyCustomButtonProps>('Slot');
```
