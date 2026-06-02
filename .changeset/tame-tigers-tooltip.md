---
'@radix-ui/react-tooltip': patch
'radix-ui': patch
---

Fixed a Tooltip bug so that `skipDelayDuration={0}` works as expected. Previously, the open delay could still be skipped when moving between triggers.
