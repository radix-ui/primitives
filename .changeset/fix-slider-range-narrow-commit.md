---
'@radix-ui/react-slider': patch
---

Fixed `onValueCommit` not being called when a range slider is narrowed to a single value from the right thumb.

The `handleSlideEnd` function was comparing individual thumb values using the tracked index, but that index gets remapped to the sorted position during the slide (e.g. index 1 → 0 when both thumbs overlap). This caused a false "no change" detection even when the range actually changed.

Fix compares the full value arrays (`String(values) !== String(prevValues)`) — the same approach already used inside `updateValues`.
