---
'@radix-ui/react-tooltip': minor
---

Add `onlyShowOnOverflow` and `overflowTolerance` to `Tooltip.Trigger` to enhance UX for overflow-only tooltip use cases. `onlyShowOnOverflow` defaults to `false`, preserving existing behavior and accessibility unless explicitly enabled. Even when explicitly enabled it preserves accessibility - only gates hover.
