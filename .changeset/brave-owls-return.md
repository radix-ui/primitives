---
'@radix-ui/react-radio-group': patch
'@radix-ui/react-slider': patch
'@radix-ui/react-switch': patch
'radix-ui': patch
---

Fixed a form reset restoring the `defaultValue` / `defaultChecked` a `RadioGroup`, `Slider` or `Switch` was mounted with instead of the one it currently has.
