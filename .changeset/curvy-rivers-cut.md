---
'@radix-ui/react-slider': patch
'radix-ui': patch
---

Fixed a bug where updating a `Slider` value programmatically inside a `<form>` would dispatch an `input` event that propagated to ancestor `onInput` handlers.
