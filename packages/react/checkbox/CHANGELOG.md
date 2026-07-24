# @radix-ui/react-checkbox

## 1.3.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.9`

## 1.3.9

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-presence@1.1.9`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-controllable-state@1.2.5`, `@radix-ui/react-use-size@1.1.3`

## 1.3.8

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fixed a bug where updating a `Checkbox`, `Switch`, or `RadioGroup` value programmatically (eg. a "select all" control) while inside a `<form>` would dispatch a `click` event from the hidden bubble input that propagated to ancestor `onClick` handlers.
- Updated dependencies: `@radix-ui/react-presence@1.1.8`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-size@1.1.2`

## 1.3.7

- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-presence@1.1.7`

## 1.3.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.3.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.3.4

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.3.3

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.3.2

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.3.1

- Fix type error emitted in build artifacts
- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.3.0

- Add unstable `Provider`, `Trigger` and `BubbleInput` parts to Checkbox ([#3459](https://github.com/radix-ui/primitives/pull/3459))
- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.2.3

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.2

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.1

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
