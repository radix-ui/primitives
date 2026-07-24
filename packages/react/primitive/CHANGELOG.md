# @radix-ui/react-primitive

## 2.1.9

- Updated dependencies: `@radix-ui/react-slot@1.3.2`

## 2.1.8

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-slot@1.3.1`

## 2.1.7

- Removed global `React.CSSProperties` augmentation from emitted declaration files.

## 2.1.6

- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.
- Updated dependencies: `@radix-ui/react-slot@1.3.0`

## 2.1.5

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-slot@1.2.5`

## 2.1.4

- Updated dependencies: `@radix-ui/react-slot@1.2.4`

## 2.1.3

- Updated dependencies: `@radix-ui/react-slot@1.2.3`

## 2.1.2

- Updated dependencies: `@radix-ui/react-slot@1.2.2`

## 2.1.1

- Updated dependencies: `@radix-ui/react-slot@1.2.1`

## 2.1.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
