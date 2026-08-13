---
"@radix-ui/react-select": patch
"radix-ui": patch
---

Fix `Select.Item` so screen readers announce the first option's position and total (`aria-posinset` / `aria-setsize`) when no value is preselected. VoiceOver + Chrome previously announced nothing for the first option in a clearable Select because the attributes were computed via React state + useLayoutEffect, which triggered a re-render — the first option was read by VoiceOver before the re-render applied the attributes. The fix sets the attributes directly on the DOM node in the layout effect, avoiding the state round-trip.
