---
"@radix-ui/react-select": patch
"radix-ui": patch
---

Fixed a bug where updating a `Select` value programmatically (eg. syncing from external state or a controlled reset) while inside a `<form>` would dispatch a `change` event from the hidden bubble input that propagated to ancestor `onChange` handlers as if the user had selected an item. This is the same class of bug fixed for `Checkbox`, `Switch`, and `RadioGroup` in #4028, and for `Slider` in #4100.
