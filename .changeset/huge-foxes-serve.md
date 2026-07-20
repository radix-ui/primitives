---
"@radix-ui/react-focus-scope": minor
"@radix-ui/react-dialog": minor
"@radix-ui/react-popover": minor
"@radix-ui/react-menu": minor
"@radix-ui/react-hover-card": minor
"radix-ui": minor
---

Fixed nested, portalled layers being unusable inside a modal layer. A non-modal popover rendered inside a modal Dialog previously broke some user interactions because the modal layer's trapped `FocusScope` reclaimed focus, and its `RemoveScroll` only allowed scrolling within the modal content.
