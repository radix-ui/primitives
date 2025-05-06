# @radix-ui/react-password-toggle-field

## 0.1.1

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 0.1.0

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

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`
