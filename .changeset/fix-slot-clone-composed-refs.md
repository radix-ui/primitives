---
'@radix-ui/react-slot': patch
---

Fixed infinite re-render loop in React 19 caused by `SlotClone` creating a new `composeRefs` callback on every render. Now uses memoized `useComposedRefs` to keep ref identity stable.
