---
'@radix-ui/react-select': patch
---

fix(select): add aria-activedescendant and fix aria-selected (#3636)

The Select component had two accessibility issues:

1. **Missing `aria-activedescendant`**: The `role="listbox"` element now has
   an `aria-activedescendant` attribute that dynamically points to the `id`
   of the currently focused option, as required by the ARIA listbox pattern.

2. **Incorrect `aria-selected`**: Previously `aria-selected` was set to
   `isSelected && isFocused`, meaning a selected item would not be announced
   as selected unless it was also focused. Changed to just `isSelected` so
   it correctly reflects selection state independent of focus.

Each `SelectItem` now has a unique `id` attribute and updates the active
descendant ref on focus/blur.
