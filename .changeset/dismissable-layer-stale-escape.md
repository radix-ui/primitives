---
"@radix-ui/react-dismissable-layer": patch
---

Fixed stale `onEscapeKeyDown`/`onDismiss` handlers on React 19.2. The escape key handling now stabilizes via `useCallbackRef` instead of the native `useEffectEvent`, which returns a stale closure inside `forwardRef` components on React 19.2.x.
