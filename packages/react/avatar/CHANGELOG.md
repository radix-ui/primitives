# @radix-ui/react-avatar

## 1.2.4

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-callback-ref@1.1.3`, `@radix-ui/react-use-is-hydrated@0.1.2`, `@radix-ui/react-use-layout-effect@1.1.3`

## 1.2.3

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fix dev-only checks with conditional exports to drop dev-warnings from production builds.
- Updated dependencies: `@radix-ui/primitive@1.1.6`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`

## 1.2.2

- Updated dependencies: `@radix-ui/react-context@1.2.0`

## 1.2.1

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.2.0

- Fixed several edge cases with Avatar's loading state
  - An avatar's fallback would not be displayed again if its image component unmounted. This is now fixed.
  - Rendering multiple `Avatar.Image` components per `Avatar.Root` was never supported and results in buggy, unpredictable behavior. We now warn about this in development.
  - Zero-sized images were treated as `loading`, meaning that `onLoadingStatusChange` is never called once loaded. A zero-sized image now triggers an `error` status on load.

### Other updates

- Fixed console warnings to show in test environments.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.1.12

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`

## 1.1.11

- Updated dependencies: `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.1.10

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.1.9

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.1.8

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.1.7

- Updated dependencies: `@radix-ui/react-use-is-hydrated@0.1.0`

## 1.1.6

- Fix breaking `useSyncExternalStore` import in Avatar

## 1.1.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
