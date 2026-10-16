---
'@radix-ui/react-dismissable-layer': patch
'radix-ui': patch
---

Fixed outside clicks not dismissing layers rendered into another window's document, such as a `window.open` popup.
