---
'@radix-ui/react-use-is-hydrated': patch
---

Use React's built-in `useSyncExternalStore` (React 18+) instead of importing the CJS-only `use-sync-external-store/shim`, with a fallback for React < 18. The shim called `require("react")` at module-evaluation time, which crashed ESM-only browser bundles when importing some components from the `radix-ui` umbrella package.
