---
'@radix-ui/react-collection': patch
'@radix-ui/react-accordion': patch
'@radix-ui/react-one-time-password-field': patch
'radix-ui': patch
---

Improved the performance of mounting collections with many items, such as `Accordion`. Items registered in the same commit now update the collection once instead of copying and sorting it per item.
