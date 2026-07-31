---
"@radix-ui/react-navigation-menu": patch
"radix-ui": patch
---

Fixed a bug with `asChild` on `NavigationMenu.Viewport` where the viewport discarded its children and rendered the active content in their place. The active content is now rendered inside the consumer's element alongside any children it already had.
