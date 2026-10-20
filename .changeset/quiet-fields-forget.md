---
'@radix-ui/react-password-toggle-field': patch
'radix-ui': patch
---

Fixed `PasswordToggleField` instances sharing internal focus state, which could restore another field's selection after toggling.
