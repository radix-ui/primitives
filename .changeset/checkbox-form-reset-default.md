---
'@radix-ui/react-checkbox': patch
'radix-ui': patch
---

Fixed an uncontrolled `Checkbox` resetting to the `defaultChecked` it was first rendered with on form reset, instead of its current `defaultChecked` (for example after a React form action).
