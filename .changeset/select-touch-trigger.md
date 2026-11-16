---
'@radix-ui/react-select': patch
---

Defer outside pointer dismissal until click and avoid retaining a pointerup guard after click activation, preventing an open Select from reopening when its trigger is touched again, including after a canceled scroll.
