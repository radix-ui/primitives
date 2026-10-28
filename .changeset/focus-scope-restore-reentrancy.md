---
'@radix-ui/react-focus-scope': patch
---

Fixed a trapped `FocusScope` recursing unboundedly when an element outside the scope refocuses itself on blur; focus restoration is now guarded against re-entrancy.
