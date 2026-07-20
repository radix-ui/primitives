# @radix-ui/react-switch

## 1.3.4

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fixed a bug where updating a `Checkbox`, `Switch`, or `RadioGroup` value programmatically (eg. a "select all" control) while inside a `<form>` would dispatch a `click` event from the hidden bubble input that propagated to ancestor `onClick` handlers.
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-size@1.1.2`

## 1.3.3

- Fixed a bug in form control components to ensure their values are updated when their associated form's is reset. This affects `RadioGroup`, `Slider`, `Select`, and `Switch`.
- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`

## 1.3.2

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.3.1

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.3.0

- Added unstable `Provider`, `Trigger` and `BubbleInput` parts to Switch. These expose the previously internal composition (context provider, the interactive control, and the hidden form input) so consumers can directly access and recompose them. The `Switch` component continues to render them by default.
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.2.6

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.2.5

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.2.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.2.3

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.2.2

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.1

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
