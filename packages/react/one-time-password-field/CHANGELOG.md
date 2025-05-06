# @radix-ui/react-one-time-password-field

## 0.1.6

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-roving-focus@1.1.9`

## 0.1.5

- - Update default input type to `text` and pass to the underlying input element ([#3510](https://github.com/radix-ui/primitives/pull/3510))
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
