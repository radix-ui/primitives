---
"@radix-ui/react-focus-scope": patch
---

Defer focus recovery after a focused element is removed from an unfocused document, so dialogs in iframes do not steal focus from another pane. Restore the focus trap when the document regains focus without overriding an already focused control, and respect paused focus scopes.
