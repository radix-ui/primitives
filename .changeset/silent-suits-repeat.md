---
'radix-ui': patch
'@radix-ui/react-tabs': patch
---

Fixed a bug where a focused element inside `Tabs.Content` were not firing blur events before switching tabs. `Tabs.Trigger` now moves focus before the tab's state change.
