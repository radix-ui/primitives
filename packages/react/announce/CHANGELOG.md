# @radix-ui/react-announce

## 0.2.14

- Updated dependencies: `@radix-ui/react-primitive@2.1.9`

## 0.2.13

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-layout-effect@1.1.3`

## 0.2.12

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-layout-effect@1.1.2`

## 0.2.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 0.2.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 0.2.9

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-layout-effect@1.1.2`

## 0.2.8

- Updated dependencies: `@radix-ui/react-primitive@2.1.4`

## 0.2.7

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 0.2.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 0.2.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 0.2.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
