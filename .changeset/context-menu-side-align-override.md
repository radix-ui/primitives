---
"@radix-ui/react-context-menu": patch
---

Allow `side`, `sideOffset`, and `align` props to be overridden on `ContextMenuContent`.

Previously these props were omitted from the TypeScript interface and the default values (`side="right"`, `sideOffset={2}`, `align="start"`) were spread after `{...contentProps}`, making them impossible to override. The defaults are now spread before `{...contentProps}` so user-provided values take precedence.

Fixes #3205
