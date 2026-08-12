---
"@radix-ui/react-select": patch
"radix-ui": patch
---

Fix `Select.Item` so screen readers announce the option's position and total (`aria-posinset` / `aria-setsize`). VoiceOver + Chrome previously announced an incorrect count (based on the options visible in the scrollable viewport) or omitted the count entirely when no value was preselected; the option now declares its own position within its list, including grouped selects.
