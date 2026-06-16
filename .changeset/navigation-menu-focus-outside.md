---
'@radix-ui/react-navigation-menu': patch
---

Fixed an open `NavigationMenu` (e.g. via `defaultValue`) being dismissed when focus moved between two elements outside the menu, such as a `Dialog` auto-focusing its close button on open.
