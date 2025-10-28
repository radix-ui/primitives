---
'@radix-ui/react-slot': patch
---

Fixed an issue with how slot components interact with lazy React components. In the case of a lazy component instance, the resulting promise must be consumed to render the desired component.
