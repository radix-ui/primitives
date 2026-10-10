---
"@radix-ui/react-dismissable-layer": patch
"radix-ui": patch
---

Fixed layers needing two outside clicks to dismiss after content inside them called `stopPropagation()` on a pointer down.
