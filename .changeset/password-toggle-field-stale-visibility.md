---
"@radix-ui/react-password-toggle-field": patch
"radix-ui": patch
---

Fixed a controlled `PasswordToggleField` staying visible after its form is submitted or reset on React 19.2. The form `submit`/`reset` handling now stabilizes `setVisible` via `useCallbackRef` instead of the native `useEffectEvent`, which returns a stale closure inside `forwardRef` components on React 19.2.x.
