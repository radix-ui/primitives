---
'radix-ui': patch
'@radix-ui/react-toast': patch
---

Fixed a bug where a paused `Toast` would not auto-close after its `duration` changed while the timer was paused.
