---
"@radix-ui/react-tooltip": patch
---

Register `TooltipContent` node as a `FocusScope` branch so that tabbing away from focusable content inside a `Tooltip` nested in a modal `Dialog` moves focus to the next element in the dialog instead of jumping back to the dialog root.
