---
'@radix-ui/react-dropdown-menu': patch
'radix-ui': patch
---

Fixed `DropdownMenu` staying open when a mouse press on the trigger is released outside the trigger and content. The menu still opens on press so a press, drag and release can select an item, and releasing elsewhere now closes it, meeting WCAG 2.5.2 Pointer Cancellation.
