---
"@radix-ui/react-checkbox": patch
"@radix-ui/react-radio-group": patch
"@radix-ui/react-switch": patch
---

Fix the hidden form input of `Checkbox`, `RadioGroup` and `Switch` overflowing the page in RTL. Its offset now flips with the inline direction.
