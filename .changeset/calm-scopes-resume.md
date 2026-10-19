---
'@radix-ui/react-focus-scope': patch
---

Keep focus scopes registered in their original stacking order after a Suspense hide and reveal, preventing underlying dialogs from reclaiming focus from newer modal layers.
