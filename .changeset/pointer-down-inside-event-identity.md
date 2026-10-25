---
"@radix-ui/react-dismissable-layer": patch
"radix-ui": patch
---

Tie inside-tree pointer capture mark to event instance to prevent stale flags from swallowing subsequent outside clicks after inner layers close or inside events stop propagation.
