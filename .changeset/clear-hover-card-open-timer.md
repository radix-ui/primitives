---
'@radix-ui/react-hover-card': patch
'radix-ui': patch
---

Fixed `HoverCard` leaving an open timer running after unmount when the trigger received pointer enter and focus in quick succession.
