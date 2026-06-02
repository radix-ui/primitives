---
"@radix-ui/react-presence": patch
"radix-ui": patch
---

Fixed a "Maximum update depth exceeded" infinite loop in React 19 that could occur when `Presence` was given a child with an unstable ref.
