---
"@radix-ui/react-alert-dialog": major
"@radix-ui/react-context-menu": major
"@radix-ui/react-dialog": major
"@radix-ui/react-dropdown-menu": major
"@radix-ui/react-menu": major
"@radix-ui/react-popover": major
"@radix-ui/react-select": major
"@radix-ui/primitive": minor
"radix-ui": major
---

Modal popovers now set the `inert` attribute on background elements outside of the modal itself. Previously we relied on `aria-hidden` which could result in inconsistencies between what was exposed to the accessibility tree and user interactions.
