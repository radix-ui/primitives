---
"@radix-ui/react-dismissable-layer": patch
---

Fixed a regression where a layer with `disableOutsidePointerEvents` could be unclickable on the first frame it appears. The `body`'s `pointer-events: none` was applied in an effect, one render before the layer's own `pointer-events: auto` override, so the layer inherited `none` from the `body` for a frame in production builds (visible to interaction test runners).
