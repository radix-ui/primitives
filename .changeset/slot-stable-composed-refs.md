---
'@radix-ui/react-slot': patch
---

Fixed infinite re-render loop in React 19 caused by `Slot` creating a new ref callback on every render
