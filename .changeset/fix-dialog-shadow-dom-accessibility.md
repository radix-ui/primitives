---
'@radix-ui/react-dialog': patch
---

Fix accessibility check for `DialogTitle` and `DialogDescription` when rendered inside Shadow DOM. Previously used `document.getElementById` which fails in Shadow DOM contexts; now uses `element.getRootNode()` to search within the correct document scope.
