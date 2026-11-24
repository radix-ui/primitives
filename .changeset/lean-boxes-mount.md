---
'@radix-ui/react-checkbox': patch
'@radix-ui/react-radio-group': patch
'@radix-ui/react-switch': patch
'radix-ui': patch
---

Improved the performance of mounting `Checkbox`, `RadioGroup` and `Switch` outside of forms. The hidden form input is no longer mounted and immediately removed on client renders.
