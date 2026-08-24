---
"@radix-ui/react-one-time-password-field": patch
"radix-ui": patch
---

Fixed a bug in `OneTimePasswordField` where pasting content that sanitized to an empty value (e.g. non-numeric text pasted into a field with the default `numeric` validation) would clear the field's existing value instead of being ignored.
