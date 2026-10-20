---
'@radix-ui/react-label': patch
'radix-ui': patch
---

Fixed `Label` not calling a consumer's `onMouseDown` handler when the mousedown target was a nested `button`, `input`, `select` or `textarea`.
