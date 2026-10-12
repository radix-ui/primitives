---
'@radix-ui/react-context-menu': patch
---

Fix nested `ContextMenu.Trigger`s all opening on a single touch long press. Only the innermost trigger now starts the long press timer.
