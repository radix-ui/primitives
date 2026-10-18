---
"@radix-ui/react-tabs": patch
"@radix-ui/react-roving-focus": patch
"radix-ui": patch
---

Fixed keyboard focus landing on `Tabs.List` instead of the active tab when tabbing back into the list after clicking a tab, and `onValueChange` being called twice when clicking an inactive tab.
