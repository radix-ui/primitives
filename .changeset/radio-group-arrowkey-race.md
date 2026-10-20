---
"@radix-ui/react-roving-focus": patch
---

Fix focus-moving roving navigation losing the arrow-key selection race in `RadioGroup`. `RovingFocusGroupItem` now defers the imperative focus via `queueMicrotask` instead of `setTimeout`, so the focus (and its resulting `onFocus`) lands before the paired `keyup` clears consumers' arrow-key detection flags. Previously, fast arrow-key presses moved focus without committing the selection.