---
'@radix-ui/react-toast': patch
---

Fixed accessibility issues:

- Removed `aria-hidden` from the focusable element, as these elements are already empty and won't be read by screen readers
- Removed `role=status` from list item element (see [w3.org documentation for List Item](https://www.w3.org/TR/html-aria/#docconformance))
- Remove useless default `aria-atomic` from `role=status`
