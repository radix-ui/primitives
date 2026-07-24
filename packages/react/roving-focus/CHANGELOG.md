# @radix-ui/react-roving-focus

## 1.1.18

- Updated dependencies: `@radix-ui/react-collection@1.1.14`, `@radix-ui/react-primitive@2.1.9`

## 1.1.17

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-collection@1.1.13`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-direction@1.1.3`, `@radix-ui/react-id@1.1.3`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-callback-ref@1.1.3`, `@radix-ui/react-use-controllable-state@1.2.5`, `@radix-ui/react-use-is-hydrated@0.1.2`, `@radix-ui/react-use-layout-effect@1.1.3`

## 1.1.16

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-collection@1.1.12`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`

## 1.1.15

- Fixed `RovingFocusGroup` items not being auto-focused on mount within a focus scope component.
- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-collection@1.1.12`

## 1.1.14

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-collection@1.1.11`

## 1.1.13

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`

## 1.1.12

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-controllable-state@1.2.3`

## 1.1.11

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`

## 1.1.10

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.1.9

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`

## 1.1.8

- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`

## 1.1.7

- Internal changes to render props

## 1.1.6

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.1.5

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.1.4

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Accept function as child
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
