---
"radix-ui": minor
"@radix-ui/react-dismissable-layer": minor
---

Added `unstable_DismissableLayer.Provider` with an `onInertElementsAdded` handler. This allows consumers the ability to better manage how outside elements are handled when appended to the DOM from inside a modal layer. This is primarily useful for dealing with compatibility issues with third party libraries that inject elements into the DOM.
