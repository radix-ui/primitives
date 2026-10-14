---
'radix-ui': patch
'@radix-ui/react-tabs': patch
---

Fixed a bug where `Tabs.Root` called `onValueChange` twice when a controlled `Tabs.Trigger` was clicked.
