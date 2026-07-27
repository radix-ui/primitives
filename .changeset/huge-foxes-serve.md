---
"@radix-ui/react-focus-scope": minor
"@radix-ui/react-dialog": patch
"@radix-ui/react-popover": patch
"@radix-ui/react-menu": patch
"@radix-ui/react-hover-card": patch
"radix-ui": patch
---

Fixed nested, portalled layers being unusable inside a modal layer. A non-modal popover rendered inside a modal Dialog previously broke some user interactions because the modal layer's trapped `FocusScope` reclaimed focus, and its `RemoveScroll` only allowed scrolling within the modal content.
