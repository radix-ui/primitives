---
'@radix-ui/react-tooltip': minor
---

Accessibility improvement: Adds an optional isLabelledBy prop to the TooltipTrigger component, allowing the tooltip content to be announced by screen readers as a label (via aria-labelledby) instead of the default description (aria-describedby). This is useful when the tooltip should serve as the accessible name of the trigger element.
