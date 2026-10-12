---
'@radix-ui/react-menu': patch
'radix-ui': patch
---

Fixed a bug where a closed `DropdownMenu`, `ContextMenu` or `Menubar` still moved focus when the pointer moved over it while animating out, taking focus away from where an item's `onSelect` had put it.
