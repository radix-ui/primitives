---
'@radix-ui/react-tooltip': patch
'radix-ui': patch
---

Fixed a controlled `Tooltip` that refuses to open making the other tooltips of its `Provider` skip their delay and close, and the delay of the `Provider` being brought back while a tooltip is open after tooltips swapped or unmounted.
