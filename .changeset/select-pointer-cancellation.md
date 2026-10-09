---
'@radix-ui/react-select': patch
'radix-ui': patch
---

Fixed `Select.Content` closing on the press of an outside pointer. It now closes on release, and releasing back inside the content cancels the dismissal without selecting an item, meeting WCAG 2.5.2 Pointer Cancellation.
