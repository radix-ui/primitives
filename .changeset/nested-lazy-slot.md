---
"@radix-ui/react-slot": patch
"radix-ui": patch
---

Fixed `Slot` throwing when an `asChild` child is a lazy reference whose resolved value is itself a lazy reference.
