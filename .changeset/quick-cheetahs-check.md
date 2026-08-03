---
"@radix-ui/react-checkbox": patch
"radix-ui": patch
---

Fixed an issue where an uncontrolled `Checkbox.Root` inside a form would not visually reflect a change to its `defaultChecked` prop after a form reset (e.g. when a server action re-renders with a new value).
