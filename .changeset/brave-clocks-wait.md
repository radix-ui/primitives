---
'@radix-ui/react-checkbox': patch
'@radix-ui/react-switch': patch
'@radix-ui/react-radio-group': patch
'radix-ui': patch
---

Fixed bugs in form-nested control components where a user-driven change was treated as programmatic in some cases, preventing bubbled event handlers from being called.
