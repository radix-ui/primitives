---
"@radix-ui/react-dismissable-layer": patch
"radix-ui": patch
---

Fixed an escape key press dismissing the layer underneath while a new layer was still registering, which closed both layers when dialogs were stacked.
