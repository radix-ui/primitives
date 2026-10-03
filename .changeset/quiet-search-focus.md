---
"@radix-ui/react-menu": minor
"@radix-ui/react-dropdown-menu": minor
"@radix-ui/react-context-menu": minor
"@radix-ui/react-menubar": minor
"radix-ui": minor
---

`SubContent` now calls a consumer's `onOpenAutoFocus` before its default open focus behavior, so it can move focus into the submenu (for example to a search input) by calling `event.preventDefault()`.
