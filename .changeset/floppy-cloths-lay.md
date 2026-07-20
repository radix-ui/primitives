---
"radix-ui": minor
"@radix-ui/react-navigation-menu": minor
---

Added an `activationMode` prop to `NavigationMenu.Root` and `NavigationMenu.Sub`.

- `"automatic"`: hovering or focusing a trigger opens its item, and moving away from the trigger closes it after a short delay. This is the default and matches the existing behavior.
- `"manual"`: pointer entry and focus never open an item; the user toggles items by clicking their trigger. An open item stays open until its trigger is clicked again, another trigger is clicked, the user clicks outside, or `Escape` is pressed.

When `activationMode` is omitted on `NavigationMenu.Sub`, it inherits the value from the parent `NavigationMenu.Root`, so setting `"manual"` on the root also applies to submenus unless a submenu opts back in to `"automatic"`.
