# @radix-ui/react-toggle

## 1.1.15

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-primitive@2.1.7`

## 1.1.14

- Updated dependencies: `@radix-ui/primitive@1.1.5`

## 1.1.13

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.1.12

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.1.11

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/primitive@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`

## 1.1.10

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.1.9

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.1.8

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.1.7

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.1.6

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.1.5

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.1.4

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
