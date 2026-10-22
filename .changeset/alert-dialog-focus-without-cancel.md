---
'@radix-ui/react-alert-dialog': patch
'radix-ui': patch
---

Fixed focus staying on the trigger, outside the dialog, when an `AlertDialog` without an `AlertDialog.Cancel` button opens. Focus now moves to the content itself.
