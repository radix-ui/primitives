---
"@radix-ui/react-dialog": patch
---

`Dialog.Content` no longer sets `aria-describedby` unless a `Dialog.Description` is rendered, fixing a dangling ARIA reference (WCAG 4.1.2) when no description is used.
