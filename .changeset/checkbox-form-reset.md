---
"@radix-ui/react-checkbox": patch
"radix-ui": patch
---

Fixed a bug where `Checkbox` did not restore its value when an externally associated form (via the `form` prop) was reset. This brings `Checkbox` in line with the fix already applied to `RadioGroup`, `Select`, `Slider`, and `Switch`.
