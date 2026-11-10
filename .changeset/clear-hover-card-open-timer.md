---
'@radix-ui/react-hover-card': patch
'radix-ui': patch
---

Fixed `HoverCard` leaving an open or close timer running after unmount when the trigger received multiple events in quick succession.
