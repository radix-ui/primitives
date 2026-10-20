---
'@radix-ui/react-dropdown-menu': patch
'radix-ui': patch
---

`DropdownMenu.Trigger` now opens on tap for touch and pen, like `Select.Trigger`, so a scroll that starts on the trigger no longer opens the menu. Mouse still opens on press.
