---
"@radix-ui/react-radio-group": patch
"@radix-ui/react-slider": patch
"@radix-ui/react-select": patch
"@radix-ui/react-switch": patch
"radix-ui": patch
---

All form control components now listen to their associated form's `reset` event and restore their initial value. This affects `RadioGroup`, `Slider`, `Select`, and `Switch`.
