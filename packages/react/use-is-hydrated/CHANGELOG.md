# @radix-ui/react-use-is-hydrated

## 0.1.1

- Added repository.directory to all package.json files
- Use React's built-in `useSyncExternalStore` (React 18+) instead of importing the CJS-only `use-sync-external-store/shim`, with a fallback for React < 18. The shim called `require("react")` at module-evaluation time, which crashed ESM-only browser bundles when importing some components from the `radix-ui` umbrella package.

## 0.1.0

- Update the dependency for `use-sync-external-store` to ensure entrypoint is valid
