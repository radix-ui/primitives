---
'@radix-ui/react-menu': patch
'radix-ui': patch
---

Fixed `DropdownMenu`, `ContextMenu` and `Menubar` closing when rendered inside an iframe and focus moved to another frame of the same page, such as the parent document.
