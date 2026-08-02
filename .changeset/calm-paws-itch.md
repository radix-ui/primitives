---
'@radix-ui/react-slider': patch
---

fix(slider): commit value on blur after keyboard navigation (#3619)

When the slider value is changed via keyboard (Arrow keys, Home, End) and
the user then tabs away (blur), `onValueCommit` was not being called.
This happened because the keyboard handlers call `onValueCommit` immediately
on each key press, but if the user blurs without pressing another key, the
last committed value was never recorded.

Added a `focusout` event listener (capture phase) on the slider root that
compares the current value against the last committed value and calls
`onValueCommit` if they differ.
