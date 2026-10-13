---
"radix-ui": patch
"@radix-ui/react-scroll-area": patch
---

Added explicit `presentation` role to `ScrollArea.Content` to prevent browsers from inferring `table` based on its display style.
