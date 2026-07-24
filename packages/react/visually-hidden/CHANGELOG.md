# @radix-ui/react-visually-hidden

## 1.2.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.9`

## 1.2.9

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-primitive@2.1.8`

## 1.2.8

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.2.7

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.2.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.2.5

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-primitive@2.1.5`

## 1.2.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.4`

## 1.2.3

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.2.2

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.2.1

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.2.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
