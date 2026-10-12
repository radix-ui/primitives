---
'@radix-ui/react-context-menu': patch
'radix-ui': patch
---

Fix nested context menu triggers opening on a single touch long press. Only the innermost trigger now starts the long press timer.
