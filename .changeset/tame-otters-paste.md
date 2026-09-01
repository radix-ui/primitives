---
"@radix-ui/react-one-time-password-field": patch
"radix-ui": patch
---

Fixed `OneTimePasswordField` clearing the existing value and moving focus to the last input when a paste event sanitizes to an empty value (e.g. pasting non-numeric text with the default numeric `validationType`, or pasting non-text clipboard content).
