---
'@radix-ui/react-dialog': patch
'@radix-ui/react-dismissable-layer': patch
'radix-ui': patch
---

A modal `Dialog` with an `Overlay` no longer sets `pointer-events: none` on `body`: the overlay already covers the page, and the inherited style restyled every element on the page when the dialog opened and closed. Layers beneath the dialog stay disabled. Elements stacked above the overlay (eg. a third-party widget) are no longer blocked.
