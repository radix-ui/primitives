---
'@radix-ui/react-select': patch
'radix-ui': patch
---

Fixed `Select.Trigger` `id` so a label's `htmlFor` points at the native select when it is mounted, and stays on the trigger otherwise.
