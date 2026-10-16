---
"@radix-ui/react-dismissable-layer": patch
"radix-ui": patch
---

Fixed a regression where a layer with `disableOutsidePointerEvents` could be un-clickable on the first frame it appears. While imperceptible to users, this can surface in tests forcing users to use timeout hacks.
