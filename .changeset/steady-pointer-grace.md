---
"@radix-ui/react-menu": patch
"@radix-ui/react-dropdown-menu": patch
"@radix-ui/react-context-menu": patch
"@radix-ui/react-menubar": patch
"radix-ui": patch
---

Fixed the submenu pointer grace area closing a submenu when an item inside the menu calls `preventDefault` on its pointer move. Menu content now tracks pointer direction regardless.
