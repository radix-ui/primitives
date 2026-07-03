---
"@radix-ui/react-scroll-area": patch
---

Fixed `--radix-scroll-area-corner-width` and `--radix-scroll-area-corner-height` not resetting to `0` when the corner is removed (eg. when one of the scrollbars is no longer visible). Previously these values would stick around and leave a permanent gap on the remaining scrollbar.
