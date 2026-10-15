---
"@radix-ui/react-select": patch
"@radix-ui/react-hover-card": patch
"@radix-ui/react-tooltip": patch
"@radix-ui/react-navigation-menu": patch
"radix-ui": patch
---

Fixed `Select`, `HoverCard`, `Tooltip`, and `NavigationMenu` dismissing immediately when a `pointerdown` lands on third-party UI (e.g. a browser extension overlay) that later stops propagation of the follow-up `click`. `Dialog` and `Popover` already deferred this dismissal via `deferPointerDownOutside`; these four components now do too.
