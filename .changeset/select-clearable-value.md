---
"@radix-ui/react-select": patch
"radix-ui": patch
---

Allow a `Select.Item` with an empty string value to act as a "clear" option. Selecting it resets the selection back to the placeholder, restoring the native `<select>` behavior for optional selects.
