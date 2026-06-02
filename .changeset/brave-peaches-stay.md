---
'@radix-ui/react-select': minor
'radix-ui': minor
---

Add unstable `Provider` and `BubbleInput` parts to Select. `Select.unstable_Provider` sets up Select's context and state without implicitly rendering the hidden native `select`, and `Select.unstable_BubbleInput` exposes that previously internal native `select` so consumers can recompose it explicitly. `Select` continues to render both by default.
