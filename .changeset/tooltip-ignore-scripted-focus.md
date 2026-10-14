---
'@radix-ui/react-tooltip': patch
'radix-ui': patch
---

Fixed a bug where a `Tooltip` opened on its own when its trigger received focus from script after a pointer interaction, such as a `Popover` or `Dialog` moving focus to its first focusable element.
