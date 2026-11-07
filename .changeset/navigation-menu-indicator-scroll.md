---
'@radix-ui/react-navigation-menu': patch
'radix-ui': patch
---

Fixed `NavigationMenu.Indicator` not following the active trigger when the list scrolls. The indicator now subtracts the scroll offset of ancestors between the trigger and the indicator track, and repositions when any of them scroll.
