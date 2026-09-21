---
'@radix-ui/react-dialog': patch
'@radix-ui/react-popover': patch
'@radix-ui/react-menu': patch
'@radix-ui/react-select': patch
'radix-ui': patch
---

Fixed modal content not being correctly isolated for assistive technologies when rendered inside a shadow root. Elements next to the content inside its shadow root(s) are now hidden with `aria-hidden`, and content rendered in nested shadow roots is no longer hidden along with the rest of the page.
