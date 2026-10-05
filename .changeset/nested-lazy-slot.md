---
"@radix-ui/react-slot": patch
---

Fixed `Slot` throwing when an `asChild` child is a lazy reference whose resolved value is itself a lazy reference (e.g. a Flight chunk that resolves to a reference to another chunk). Nested references are now unwrapped to completion instead of only one level, and `Slottable`'s `child` prop is unwrapped too.
