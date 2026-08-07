---
"@radix-ui/react-popper": patch
---

Allow `PopperAnchor`'s `virtualRef` to accept a `RefObject<Measurable | null>`, matching the type that `useRef<Measurable>(null)` returns in React 19.
