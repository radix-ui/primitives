---
"@radix-ui/react-select": patch
---

Fixed a bug where updating a `Select` value programmatically while inside a `<form>` would dispatch a `click` event from the hidden bubble select that propagated to ancestor `onClick` handlers.
