---
"radix-ui": patch
"@radix-ui/react-tooltip": patch
---

Fixed `Tooltip` opening automatically when its trigger receives focus programmatically, e.g. when it is the first focusable element inside a `Popover` or `Dialog` that auto-focuses its content on open. The tooltip now only opens on focus that comes from a genuine user interaction (such as tabbing to the trigger), determined using `:focus-visible`. Hover-triggered opening is unaffected.
