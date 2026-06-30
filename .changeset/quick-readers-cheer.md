---
'@radix-ui/react-dismissable-layer': patch
'@radix-ui/react-dropdown-menu': patch
'@radix-ui/react-navigation-menu': patch
'@radix-ui/react-focus-scope': patch
'@radix-ui/react-scroll-area': patch
'@radix-ui/react-select': patch
'@radix-ui/react-popper': patch
'@radix-ui/react-slider': patch
'@radix-ui/react-toast': patch
'@radix-ui/react-menu': patch
'@radix-ui/react-use-escape-keydown': patch
---

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callbacks being recreated on every render.
- Deprecated `useEscapeKeydown` in favor of attaching listeners directly via `useEffect` for more granular control over how callbacks are stabilized, when to detach listeners, etc.
