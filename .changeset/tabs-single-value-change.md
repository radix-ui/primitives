---
'@radix-ui/react-tabs': patch
'radix-ui': patch
---

Fixed `Tabs.Trigger` calling `onValueChange` twice for a single click when `Tabs` is controlled and uses automatic activation.
