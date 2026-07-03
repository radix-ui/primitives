---
"@radix-ui/react-dropdown-menu": minor
---

Added an `activationMode` prop to `DropdownMenu.Trigger` that controls how the trigger opens the menu. 

- `"pointer-down"`: Opens on pointer down to match native menu behavior. This is the default behavior.
- `"click"`: Opens on a full click event. Use `"click"` when opening on pointer down conflicts with other interactions such as dragging or text selection.
