---
"@radix-ui/react-context": patch
"radix-ui": patch
---

Export the hook interfaces (`UseContext`, `UseAssertedContext`, `UseScopedContext`, `UseAssertedScopedContext`, and `CreateScopedContext`) from `@radix-ui/react-context` so declaration emit can name the type of a re-exported hook. Previously, re-exporting a hook created with `createContext` from a package with `declaration: true` failed with `TS4023`.
