---
"@radix-ui/react-select": patch
---

Fixed `Select` snapping the scroll position back to the selected item while scrolling with the pointer, wheel, or touch when `Select.ScrollUpButton` or `Select.ScrollDownButton` are present. The scroll-into-view that runs when a scroll button mounts now only fires when keyboard focus moves to a different item, so it no longer interferes with manual scrolling.
