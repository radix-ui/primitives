---
"@radix-ui/react-use-size": patch
---

Wrap the `ResizeObserver` callback in `requestAnimationFrame` to avoid the benign `ResizeObserver loop completed with undelivered notifications` error in performance-heavy applications.
