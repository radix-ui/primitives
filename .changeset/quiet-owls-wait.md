---
'@radix-ui/react-avatar': patch
'radix-ui': patch
---

Fixed `Avatar.Fallback` never rendering when `delayMs` changed to `undefined` before the delay elapsed.
