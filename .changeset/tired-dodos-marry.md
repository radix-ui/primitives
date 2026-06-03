---
"@radix-ui/react-one-time-password-field": patch
"radix-ui": patch
---

Fixed pasting into One-Time Password Field in environments that do not support the legacy `"Text"` clipboard format by reading the pasted value as `"text/plain"`
