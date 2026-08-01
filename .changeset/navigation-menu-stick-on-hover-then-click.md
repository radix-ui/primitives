---
'@radix-ui/react-navigation-menu': patch
---

Keep dropdown open on click after hover-open.

Previously, hovering a trigger opened the dropdown but a subsequent click on the same trigger closed it, because `onItemSelect` toggled state based purely on whether the current open value matched the trigger — with no notion of how the menu was opened. The trigger now swallows a click when it was just opened by hover, so the dropdown sticks open. Subsequent clicks still toggle closed; click-to-open on a closed trigger is unchanged.

For folks comparing primitives in the shadcn ecosystem, Base UI's `NavigationMenuTrigger` gets the same behavior via Floating UI's `useClick({ stickIfOpen })`.
