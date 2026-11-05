---
'@radix-ui/react-dismissable-layer': patch
'radix-ui': patch
---

Fixed a `Popover` closing right after opening when a sibling `Popover` sharing the same controlled `open` state was open and its trigger was clicked.
