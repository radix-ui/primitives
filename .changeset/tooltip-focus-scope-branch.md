---
"@radix-ui/react-tooltip": patch
"radix-ui": patch
---

Fixed a bug in Tooltip so that tabbing away from focusable tooltip trigger nested in a modal popover moves focus to the next element in the popover instead of the popover's root.
