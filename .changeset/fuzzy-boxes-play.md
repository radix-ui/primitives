---
'@radix-ui/react-context-menu': minor
'radix-ui': minor
---

Added support for a controlled `open` prop on `ContextMenu.Root`. This is intended for reading the open state and closing the menu programmatically, though we discourage opening the menu programmatically since opening the menu depends on user interaction to position the menu.
