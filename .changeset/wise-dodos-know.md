---
"radix-ui": patch
"@radix-ui/react-checkbox": patch
"@radix-ui/react-switch": patch
"@radix-ui/react-radio-group": patch
---

Fixed a bug where updating a `Checkbox`, `Switch`, or `RadioGroup` value programmatically (eg. a "select all" control) while inside a `<form>` would dispatch a `click` event from the hidden bubble input that propagated to ancestor `onClick` handlers.
