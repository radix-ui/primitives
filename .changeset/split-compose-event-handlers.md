---
'@radix-ui/primitive': patch
---

Split `composeEventHandlers` into `composeEvent` and `composePreventableEvent`

The `composeEventHandlers` function with its `checkForDefaultPrevented` option has been split into two clearer utilities:
- `composeEvent`: Always calls both handlers
- `composePreventableEvent`: Only calls our handler if default wasn't prevented

`composeEventHandlers` is now deprecated but kept for backward compatibility.
