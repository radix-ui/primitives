---
'@radix-ui/react-popper': patch
---

Set the `PopperAnchor` DOM anchor from a callback ref instead of an effect so mounting many Popper-based components (Tooltip, Popover, DropdownMenu, HoverCard) at once no longer counts toward React's nested update depth limit and triggers "Maximum update depth exceeded". Virtual anchors continue to be read on every render so a swapped or late-assigned `virtualRef.current` is still picked up.
