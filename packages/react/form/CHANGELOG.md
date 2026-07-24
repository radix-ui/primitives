# @radix-ui/react-form

## 0.1.15

- Updated dependencies: `@radix-ui/react-primitive@2.1.9`, `@radix-ui/react-label@2.1.14`

## 0.1.14

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-id@1.1.3`, `@radix-ui/react-label@2.1.13`, `@radix-ui/react-primitive@2.1.8`

## 0.1.13

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-label@2.1.12`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.7`

## 0.1.12

### > IMPORTANT: `@radix-ui/react-context` is marked for a minor release since it introduces additive overloaded types and function arguments. At release time, changesets will determine that its dependents should also be marked for a minor release, but this is not the case since it the only change for those packages impacts internal usage. In `radix-ui` this export is exposed from the `internal` module, whose exports do not impact public API and therefore do not follow semver.

Fixed runtime errors for `Form.Message`, `Form.Control`, `Form.Label` and `Form.ValidityState` that are correctly rendered outside of `Form.Field` components

### Other updates

- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`

## 0.1.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-label@2.1.11`

## 0.1.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-label@2.1.10`

## 0.1.9

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-label@2.1.9`, `@radix-ui/react-primitive@2.1.5`

## 0.1.8

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-label@2.1.8`

## 0.1.7

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-label@2.1.7`, `@radix-ui/react-primitive@2.1.3`

## 0.1.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-label@2.1.6`

## 0.1.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-label@2.1.5`

## 0.1.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-label@2.1.4`
