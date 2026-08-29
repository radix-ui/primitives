---
"@radix-ui/react-scroll-area": patch
"radix-ui": patch
---

Fixed the scrollbar thumb not tracking the scroll position in minified builds. The loop that polls the viewport was written as an IIFE, which `keepNames` emits as a `/* @__PURE__ */` annotated call, allowing a minifier to drop it as an unused expression.
