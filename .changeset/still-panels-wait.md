---
'@radix-ui/react-collapsible': patch
'@radix-ui/react-accordion': patch
'radix-ui': patch
---

Improved the performance of mounting closed `Collapsible` and `Accordion` content. Closed content is no longer measured, which forced a layout per item.
