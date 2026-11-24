---
'@radix-ui/react-select': patch
'radix-ui': patch
---

Improved the performance of opening, closing and mounting `Select`. Items no longer re-render when the native options or the content's internal state change.
