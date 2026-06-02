---
'@radix-ui/react-radio-group': minor
'radix-ui': minor
---

Add unstable `RadioGroupItemProvider`, `RadioGroupItemTrigger` and `RadioGroupItemBubbleInput` parts. These expose the previously internal composition of a radio item (context provider, the interactive control, and the hidden form input) so consumers can directly access and recompose them. The `RadioGroupItem` component continues to render them by default.
