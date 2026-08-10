---
"radix-ui": patch
"@radix-ui/react-slider": patch
---

Fixed a bug where updating a `Slider` value programmatically (eg. syncing from external state or a controlled reset) while inside a `<form>` would dispatch an `input` event from the hidden bubble input that propagated to ancestor `onInput`/`onChange` handlers as if the user had dragged the thumb. This is the same class of bug fixed for `Checkbox`, `Switch`, and `RadioGroup` in #4028.
