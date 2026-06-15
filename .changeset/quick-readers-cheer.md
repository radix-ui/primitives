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
---

Fixed infinite re-render loop in React 19 caused by unstable composed ref callbacks being recreated on every render.
