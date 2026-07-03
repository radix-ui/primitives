---
"@radix-ui/react-slider": patch
---

Fixed keyboard stepping skipping a valid value when the current value is off the step grid (eg, a `defaultValue` that isn't a multiple of `step` from `min`). Stepping now snaps to the next step-aligned value in the direction of travel, matching native `<input type="range">` behavior.
