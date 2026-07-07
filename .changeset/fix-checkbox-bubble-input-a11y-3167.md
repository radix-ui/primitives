---
'@radix-ui/react-checkbox': patch
---

Fix bubble input accessibility by using the native `hidden` attribute instead of `aria-hidden`, and mirror label association from the control to the hidden input.
