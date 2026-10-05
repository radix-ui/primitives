---
"@radix-ui/react-radio-group": patch
"radix-ui": patch
---

Fixed an uncontrolled `RadioGroup` restoring the `defaultValue` from its first render when its form is reset. A form reset now restores the latest `defaultValue`, and the hidden input stays in sync with the visible selection, so the selection is kept after a React 19 form action resets the form.
