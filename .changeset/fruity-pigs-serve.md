---
'@radix-ui/react-switch': minor
'radix-ui': minor
---

Add unstable `Provider`, `Trigger` and `BubbleInput` parts to Switch. These expose the previously internal composition (context provider, the interactive control, and the hidden form input) so consumers can directly access and recompose them. The `Switch` component continues to render them by default.
