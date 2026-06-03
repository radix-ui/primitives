---
"@radix-ui/react-focus-scope": patch
"@radix-ui/react-dialog": patch
"@radix-ui/react-popover": patch
"@radix-ui/react-menu": patch
"@radix-ui/react-hover-card": patch
"radix-ui": patch
---

Fixed nested, portalled layers being unusable inside a modal layer. A non-modal popover rendered inside a modal Dialog previously broke some user interactions because the modal layer's trapped `FocusScope` reclaimed focus, and its `RemoveScroll` only allowed scrolling within the modal content.

`FocusScope` now accepts branches that are treated as part of the scope, and modal layers register nested portalled layers as branches so focus and scroll work as expected. This works for any depth of nesting between modal containers.

See: https://github.com/radix-ui/primitives/issues/3423
