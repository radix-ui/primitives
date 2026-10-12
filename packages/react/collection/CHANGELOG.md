# @radix-ui/react-collection

## 1.2.0

- **Breaking:** Renamed `unstable_CollectionProps` to `unstable_CollectionSlotProps` and `unstable_CollectionItemMap` to `unstable_CollectionDict`.
- Added `useGetCollection` to the functions returned from `unstable_createCollection`.
- Fixed display names of the collection context providers returned from `unstable_createCollection`.
- Allow explicit `undefined` for all optional types for compatibility with TypeScript's `exactOptionalPropertyTypes` flag.
- Fixed collections keeping a stale item order when React moved items in the DOM without remounting them.
- Updated dependencies: `@radix-ui/react-context@1.3.0`, `@radix-ui/react-primitive@2.2.0`, `@radix-ui/react-slot@1.5.0`

## 1.1.16

- Updated dependencies: `@radix-ui/react-slot@1.4.0`, `@radix-ui/react-primitive@2.1.11`

## 1.1.15

- Reverted breaking changes that caused compatibility issues with React Server Components.
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.5`, `@radix-ui/react-context@1.2.2`, `@radix-ui/react-primitive@2.1.10`, `@radix-ui/react-slot@1.3.3`

## 1.1.14

- Updated dependencies: `@radix-ui/react-slot@1.3.2`, `@radix-ui/react-primitive@2.1.9`

## 1.1.13

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-slot@1.3.1`

## 1.1.12

- Updated dependencies: `@radix-ui/react-context@1.2.0`

## 1.1.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.1.10

- Updated dependencies: `@radix-ui/react-slot@1.3.0`, `@radix-ui/react-primitive@2.1.6`

## 1.1.9

- Updated `unstable_createCollection` signature to extend `BaseItemData` internally
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-slot@1.2.5`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`

## 1.1.8

- Updated dependencies: `@radix-ui/react-slot@1.2.4`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.1.7

- Updated dependencies: `@radix-ui/react-slot@1.2.3`, `@radix-ui/react-primitive@2.1.3`

## 1.1.6

- Updated dependencies: `@radix-ui/react-slot@1.2.2`, `@radix-ui/react-primitive@2.1.2`

## 1.1.5

- Updated dependencies: `@radix-ui/react-slot@1.2.1`, `@radix-ui/react-primitive@2.1.1`

## 1.1.4

- Add unstable collection utilities
- Minor changes to unreleased unstable APIs
- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
