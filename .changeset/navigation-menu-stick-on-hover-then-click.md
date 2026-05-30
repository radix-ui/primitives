---
'@radix-ui/react-navigation-menu': patch
---

Keep dropdown open on click after hover-open. Previously a hover-opened trigger would close on the first click; now it stays open (matching Base UI's `stickIfOpen` behavior). Subsequent clicks still toggle closed; click-to-open is unchanged.
