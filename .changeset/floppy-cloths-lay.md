---
"@radix-ui/react-navigation-menu": minor
"radix-ui": minor
---

Added an `activationMode` prop to `NavigationMenu.Root` and `NavigationMenu.Sub`.

- `"automatic"`: Hovering or focusing a trigger opens its item, and moving away from the trigger closes it after a short delay. This is the default and matches existing behavior.
- `"manual"`: Pointer entry and focus never open an item; the item is opened by clicking its trigger.

When `activationMode` is omitted on `NavigationMenu.Sub`, it inherits the value from the parent `NavigationMenu.Root`, so setting `"manual"` on the root also applies to submenus unless a submenu opts back in to `"automatic"`.
