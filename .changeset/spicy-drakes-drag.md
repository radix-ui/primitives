---
"radix-ui": patch
"@radix-ui/react-dismissable-layer": patch
---

Fixed a bug where drag interactions that originate inside a modal layer (eg. a `Dialog`) would break when the interaction relied on a helper element appended to the `body`. Modal layers set `pointer-events: none` on the `body`, which was inherited by such elements (eg. the full-viewport "drag cover" that charting/drag libraries like Plotly create on pointer down), preventing them from receiving pointer events. These elements now remain interactive while the page behind the layer stays inert.
