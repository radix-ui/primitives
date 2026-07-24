# @radix-ui/react-progress

## 1.1.15

- Updated dependencies: `@radix-ui/react-primitive@2.1.9`

## 1.1.14

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-context@1.2.1`, `@radix-ui/react-primitive@2.1.8`

## 1.1.13

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`

## 1.1.12

- Updated dependencies: `@radix-ui/react-context@1.2.0`

## 1.1.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.1.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.1.9

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`

## 1.1.8

- Updated dependencies: `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.1.7

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.1.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.1.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.1.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
