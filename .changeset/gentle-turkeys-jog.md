---
'radix-ui': patch
'@radix-ui/react-select': patch
---

Fixed a bug where internal event handlers were still being called on a disabled `Select.Item` elements. Consumer-provided event handlers still run, but Radix's own selection logic no longer fires for disabled items.
