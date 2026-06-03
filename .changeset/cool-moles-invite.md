---
'@radix-ui/react-dialog': patch
---

- Improved accessibility check logic in Dialog component
  - Restricted title and description element checks to be scoped within Dialog Content for more accurate validation
  - Enhanced compatibility with Shadow DOM environments
