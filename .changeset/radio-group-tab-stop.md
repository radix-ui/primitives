---
'@radix-ui/react-focus-scope': patch
'radix-ui': patch
---

Fixed a looping `FocusScope` (as in `Dialog` and `Popover`) letting `Tab` leave it from a native radio group at its edge, because every radio was treated as its own tab stop.
