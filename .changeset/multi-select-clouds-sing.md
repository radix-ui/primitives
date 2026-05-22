---
'@radix-ui/react-select': minor
'@repo/storybook': patch
---

Add multi-select support via a new `multiple` prop on `Select.Root`. When `multiple` is `true`, `value` / `defaultValue` accept `string[]`, `onValueChange` receives the new array, and selecting an item toggles it without closing the popover. The hidden native `<select>` is rendered with the `multiple` attribute so `FormData` carries every selected option. The listbox advertises `aria-multiselectable="true"`, `aria-selected` reflects the real selection regardless of focus, and `Select.Content` defaults to `position="popper"` because the item-aligned positioner has no single anchor in multi-select.
