# @radix-ui/react-one-time-password-field

## 0.1.13

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-roving-focus@1.1.16`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/number@1.1.2`, `@radix-ui/react-collection@1.1.12`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-effect-event@0.0.3`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`

## 0.1.12

- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-roving-focus@1.1.15`, `@radix-ui/react-collection@1.1.12`

## 0.1.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-collection@1.1.11`, `@radix-ui/react-roving-focus@1.1.14`

## 0.1.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`, `@radix-ui/react-roving-focus@1.1.13`

## 0.1.9

- Fixed OTP field dispatch using stale value/collection state in React 19.2+.
- Truncate pasted values that exceed the field length
- Added repository.directory to all package.json files
- Fixed pasting into One-Time Password Field in environments that do not support the legacy `"Text"` clipboard format by reading the pasted value as `"text/plain"`
- Updated dependencies: `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/number@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-roving-focus@1.1.12`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-effect-event@0.0.3`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`

## 0.1.8

- Fixed a bug so that all input elements are disabled when the `Root` component is disabled
- Fixed a bug with iOS Chrome autocomplete (#3641)
- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-roving-focus@1.1.11`

## 0.1.7

- Updated dependencies: `@radix-ui/react-roving-focus@1.1.10`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 0.1.6

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-roving-focus@1.1.9`

## 0.1.5

- Update default input type to `text` and pass to the underlying input element ([#3510](https://github.com/radix-ui/primitives/pull/3510))
- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-roving-focus@1.1.8`

## 0.1.4

- Updated dependencies: `@radix-ui/react-use-is-hydrated@0.1.0`

## 0.1.3

- Fix hydration mismatch error in `OneTimePasswordField` and add opt-in `index` prop
- Updated dependencies: `@radix-ui/react-roving-focus@1.1.7`

## 0.1.2

- Updated dependencies: `@radix-ui/react-use-effect-event@0.0.2`, `@radix-ui/react-use-controllable-state@1.2.2`, `@radix-ui/react-roving-focus@1.1.6`

## 0.1.1

- Updated dependencies: `@radix-ui/react-use-effect-event@0.0.1`, `@radix-ui/react-use-controllable-state@1.2.1`, `@radix-ui/react-roving-focus@1.1.5`

## 0.1.0

### Introduce new One Time Password Field primitive

This new primitive is designed to implement the common design pattern for one-time password fields displayed as separate input fields for each character. This UI is deceptively complex to implement so that interactions follow user expectations. The new primitive handles all of this complexity for you, including:

- Keyboard navigation mimicking the behavior of a single input field
- Overriding values on paste
- Password manager autofill support
- Input validation for numeric and alphanumeric values
- Auto-submit on completion
- Focus management
- Hidden input to provide a single value to form data

### Other updates

- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-roving-focus@1.1.4`, `@radix-ui/react-primitive@2.1.0`
