# radix-ui

## 1.4.1

- Updated dependencies: `@radix-ui/react-slot@1.2.2`, `@radix-ui/react-checkbox@1.3.1`, `@radix-ui/react-alert-dialog@1.1.13`, `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-dialog@1.1.13`, `@radix-ui/react-menu@2.1.14`, `@radix-ui/react-popover@1.1.13`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-select@2.2.4`, `@radix-ui/react-tooltip@1.2.6`, `@radix-ui/react-accordion@1.2.10`, `@radix-ui/react-menubar@1.1.14`, `@radix-ui/react-navigation-menu@1.2.12`, `@radix-ui/react-one-time-password-field@0.1.6`, `@radix-ui/react-roving-focus@1.1.9`, `@radix-ui/react-slider@1.3.4`, `@radix-ui/react-toast@1.2.13`, `@radix-ui/react-context-menu@2.2.14`, `@radix-ui/react-dropdown-menu@2.1.14`, `@radix-ui/react-arrow@1.1.6`, `@radix-ui/react-aspect-ratio@1.1.6`, `@radix-ui/react-avatar@1.1.9`, `@radix-ui/react-collapsible@1.1.10`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-focus-scope@1.1.6`, `@radix-ui/react-form@0.1.6`, `@radix-ui/react-hover-card@1.1.13`, `@radix-ui/react-label@2.1.6`, `@radix-ui/react-password-toggle-field@0.1.1`, `@radix-ui/react-popper@1.2.6`, `@radix-ui/react-portal@1.1.8`, `@radix-ui/react-progress@1.1.6`, `@radix-ui/react-radio-group@1.3.6`, `@radix-ui/react-scroll-area@1.2.8`, `@radix-ui/react-separator@1.1.6`, `@radix-ui/react-switch@1.2.4`, `@radix-ui/react-tabs@1.1.11`, `@radix-ui/react-toggle@1.1.8`, `@radix-ui/react-toggle-group@1.1.9`, `@radix-ui/react-toolbar@1.1.9`, `@radix-ui/react-visually-hidden@1.2.2`, `@radix-ui/react-accessible-icon@1.1.6`

## 1.4.0

### Introduce new Password Toggle Field primitive

This new primitive provides components for rendering a password input alongside a button to toggle its visibility. Aside from its primary functionality, it also includes:

- Returning focus to the input when toggling with a pointer
- Maintaining focus when toggling with keyboard or virtual navigation
- Resetting visibility to hidden after form submission to prevent accidental storage
- Implicit accessible labeling for icon-based toggle buttons

This API is currently unstable, and we hope you'll help us test it out! Import the primitive using the `unstable_` prefix.

```tsx
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';

function FieldWithIconToggle() {
  return (
    <PasswordToggleField.Root>
      <PasswordToggleField.Input />
      <PasswordToggleField.Toggle>
        <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}

function FieldWithTextToggle() {
  return (
    <PasswordToggleField.Root>
      <PasswordToggleField.Input />
      <PasswordToggleField.Toggle>
        <PasswordToggleField.Slot visible="Hide password" hidden="Show password" />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}
```

### Other updates

- Add unstable `Provider`, `Trigger` and `BubbleInput` parts to Checkbox ([#3459](https://github.com/radix-ui/primitives/pull/3459))
- Updated dependencies: `@radix-ui/react-slot@1.2.1`, `@radix-ui/react-one-time-password-field@0.1.5`, `@radix-ui/react-checkbox@1.3.0`, `@radix-ui/react-radio-group@1.3.5`, `@radix-ui/react-password-toggle-field@0.1.0`, `@radix-ui/react-alert-dialog@1.1.12`, `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-dialog@1.1.12`, `@radix-ui/react-menu@2.1.13`, `@radix-ui/react-popover@1.1.12`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-select@2.2.3`, `@radix-ui/react-tooltip@1.2.5`, `@radix-ui/react-accordion@1.2.9`, `@radix-ui/react-menubar@1.1.13`, `@radix-ui/react-navigation-menu@1.2.11`, `@radix-ui/react-roving-focus@1.1.8`, `@radix-ui/react-slider@1.3.3`, `@radix-ui/react-toast@1.2.12`, `@radix-ui/react-context-menu@2.2.13`, `@radix-ui/react-dropdown-menu@2.1.13`, `@radix-ui/react-arrow@1.1.5`, `@radix-ui/react-aspect-ratio@1.1.5`, `@radix-ui/react-avatar@1.1.8`, `@radix-ui/react-collapsible@1.1.9`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-focus-scope@1.1.5`, `@radix-ui/react-form@0.1.5`, `@radix-ui/react-hover-card@1.1.12`, `@radix-ui/react-label@2.1.5`, `@radix-ui/react-popper@1.2.5`, `@radix-ui/react-portal@1.1.7`, `@radix-ui/react-progress@1.1.5`, `@radix-ui/react-scroll-area@1.2.7`, `@radix-ui/react-separator@1.1.5`, `@radix-ui/react-switch@1.2.3`, `@radix-ui/react-tabs@1.1.10`, `@radix-ui/react-toggle@1.1.7`, `@radix-ui/react-toggle-group@1.1.8`, `@radix-ui/react-toolbar@1.1.8`, `@radix-ui/react-visually-hidden@1.2.1`, `@radix-ui/react-accessible-icon@1.1.5`

## 1.3.4

- Updated dependencies: `@radix-ui/react-use-is-hydrated@0.1.0`, `@radix-ui/react-presence@1.1.4`, `@radix-ui/react-avatar@1.1.7`, `@radix-ui/react-one-time-password-field@0.1.4`, `@radix-ui/react-checkbox@1.2.3`, `@radix-ui/react-collapsible@1.1.8`, `@radix-ui/react-dialog@1.1.11`, `@radix-ui/react-hover-card@1.1.11`, `@radix-ui/react-menu@2.1.12`, `@radix-ui/react-navigation-menu@1.2.10`, `@radix-ui/react-popover@1.1.11`, `@radix-ui/react-radio-group@1.3.4`, `@radix-ui/react-scroll-area@1.2.6`, `@radix-ui/react-tabs@1.1.9`, `@radix-ui/react-toast@1.2.11`, `@radix-ui/react-tooltip@1.2.4`, `@radix-ui/react-accordion@1.2.8`, `@radix-ui/react-alert-dialog@1.1.11`, `@radix-ui/react-context-menu@2.2.12`, `@radix-ui/react-dropdown-menu@2.1.12`, `@radix-ui/react-menubar@1.1.12`

## 1.3.3

- Updated dependencies: `@radix-ui/react-one-time-password-field@0.1.3`, `@radix-ui/react-roving-focus@1.1.7`, `@radix-ui/react-menu@2.1.11`, `@radix-ui/react-menubar@1.1.11`, `@radix-ui/react-radio-group@1.3.3`, `@radix-ui/react-tabs@1.1.8`, `@radix-ui/react-toggle-group@1.1.7`, `@radix-ui/react-toolbar@1.1.7`, `@radix-ui/react-context-menu@2.2.11`, `@radix-ui/react-dropdown-menu@2.1.11`

## 1.3.2

- Updated dependencies: `@radix-ui/react-use-effect-event@0.0.2`, `@radix-ui/react-avatar@1.1.6`, `@radix-ui/react-one-time-password-field@0.1.2`, `@radix-ui/react-use-controllable-state@1.2.2`, `@radix-ui/react-accordion@1.2.7`, `@radix-ui/react-checkbox@1.2.2`, `@radix-ui/react-collapsible@1.1.7`, `@radix-ui/react-context-menu@2.2.10`, `@radix-ui/react-dialog@1.1.10`, `@radix-ui/react-dropdown-menu@2.1.10`, `@radix-ui/react-hover-card@1.1.10`, `@radix-ui/react-menubar@1.1.10`, `@radix-ui/react-navigation-menu@1.2.9`, `@radix-ui/react-popover@1.1.10`, `@radix-ui/react-radio-group@1.3.2`, `@radix-ui/react-roving-focus@1.1.6`, `@radix-ui/react-select@2.2.2`, `@radix-ui/react-slider@1.3.2`, `@radix-ui/react-switch@1.2.2`, `@radix-ui/react-tabs@1.1.7`, `@radix-ui/react-toast@1.2.10`, `@radix-ui/react-toggle@1.1.6`, `@radix-ui/react-toggle-group@1.1.6`, `@radix-ui/react-tooltip@1.2.3`, `@radix-ui/react-alert-dialog@1.1.10`, `@radix-ui/react-menu@2.1.10`, `@radix-ui/react-toolbar@1.1.6`

## 1.3.1

- Updated dependencies: `@radix-ui/react-use-effect-event@0.0.1`, `@radix-ui/react-one-time-password-field@0.1.1`, `@radix-ui/react-use-controllable-state@1.2.1`, `@radix-ui/react-accordion@1.2.6`, `@radix-ui/react-checkbox@1.2.1`, `@radix-ui/react-collapsible@1.1.6`, `@radix-ui/react-context-menu@2.2.9`, `@radix-ui/react-dialog@1.1.9`, `@radix-ui/react-dropdown-menu@2.1.9`, `@radix-ui/react-hover-card@1.1.9`, `@radix-ui/react-menubar@1.1.9`, `@radix-ui/react-navigation-menu@1.2.8`, `@radix-ui/react-popover@1.1.9`, `@radix-ui/react-radio-group@1.3.1`, `@radix-ui/react-roving-focus@1.1.5`, `@radix-ui/react-select@2.2.1`, `@radix-ui/react-slider@1.3.1`, `@radix-ui/react-switch@1.2.1`, `@radix-ui/react-tabs@1.1.6`, `@radix-ui/react-toast@1.2.9`, `@radix-ui/react-toggle@1.1.5`, `@radix-ui/react-toggle-group@1.1.5`, `@radix-ui/react-tooltip@1.2.2`, `@radix-ui/react-alert-dialog@1.1.9`, `@radix-ui/react-menu@2.1.9`, `@radix-ui/react-toolbar@1.1.5`

## 1.3.0

### Introduce new One Time Password Field primitive

This new primitive is designed to implement the common design pattern for one-time password fields displayed as separate input fields for each character. This UI is deceptively complex to implement so that interactions follow user expectations. The new primitive handles all of this complexity for you, including:

- Keyboard navigation mimicking the behavior of a single input field
- Overriding values on paste
- Password manager autofill support
- Input validation for numeric and alphanumeric values
- Auto-submit on completion
- Focus management
- Hidden input to provide a single value to form data

This API is currently unstable, and we hope you'll help us test it out! Import the primitive using the `unstable_` prefix.

```tsx
import { unstable_OneTimePasswordField as OneTimePasswordField } from 'radix-ui';

export function Verify() {
  return (
    <OneTimePasswordField.Root>
      <OneTimePasswordField.Input />
      <OneTimePasswordField.Input />
      <OneTimePasswordField.Input />
      <OneTimePasswordField.Input />
      <OneTimePasswordField.Input />
      <OneTimePasswordField.Input />
      <OneTimePasswordField.HiddenInput />
    </OneTimePasswordField.Root>
  );
}
```

### Other updates

- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-navigation-menu@1.2.7`, `@radix-ui/react-dropdown-menu@2.1.8`, `@radix-ui/react-context-menu@2.2.8`, `@radix-ui/react-roving-focus@1.1.4`, `@radix-ui/react-toggle-group@1.1.4`, `@radix-ui/react-collapsible@1.1.5`, `@radix-ui/react-radio-group@1.3.0`, `@radix-ui/react-hover-card@1.1.8`, `@radix-ui/react-accordion@1.2.5`, `@radix-ui/react-checkbox@1.2.0`, `@radix-ui/react-menubar@1.1.8`, `@radix-ui/react-popover@1.1.8`, `@radix-ui/react-tooltip@1.2.1`, `@radix-ui/react-dialog@1.1.8`, `@radix-ui/react-select@2.2.0`, `@radix-ui/react-switch@1.2.0`, `@radix-ui/react-toggle@1.1.4`, `@radix-ui/react-toast@1.2.8`, `@radix-ui/react-tabs@1.1.5`, `@radix-ui/react-one-time-password-field@0.1.0`, `@radix-ui/react-visually-hidden@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-slider@1.3.0`, `@radix-ui/react-menu@2.1.8`, `@radix-ui/react-toolbar@1.1.4`, `@radix-ui/react-alert-dialog@1.1.8`, `@radix-ui/react-accessible-icon@1.1.4`, `@radix-ui/react-arrow@1.1.4`, `@radix-ui/react-aspect-ratio@1.1.4`, `@radix-ui/react-avatar@1.1.5`, `@radix-ui/react-dismissable-layer@1.1.7`, `@radix-ui/react-focus-scope@1.1.4`, `@radix-ui/react-form@0.1.4`, `@radix-ui/react-label@2.1.4`, `@radix-ui/react-popper@1.2.4`, `@radix-ui/react-portal@1.1.6`, `@radix-ui/react-progress@1.1.4`, `@radix-ui/react-scroll-area@1.2.5`, `@radix-ui/react-separator@1.1.4`
