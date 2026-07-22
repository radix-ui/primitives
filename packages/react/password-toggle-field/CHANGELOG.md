# @radix-ui/react-password-toggle-field

## 0.1.9

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-id@1.1.3`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-controllable-state@1.2.5`, `@radix-ui/react-use-effect-event@0.0.4`, `@radix-ui/react-use-is-hydrated@0.1.2`

## 0.1.8

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fix dev-only checks with conditional exports to drop dev-warnings from production builds.
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-effect-event@0.0.3`, `@radix-ui/react-use-is-hydrated@0.1.1`

## 0.1.7

- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`

## 0.1.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 0.1.5

- Renamed misspelled `onVisiblityChange` prop to `onVisibilityChange`.
- Fixed prop type definitions to include `asChild` for all component parts.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 0.1.4

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-effect-event@0.0.3`, `@radix-ui/react-use-is-hydrated@0.1.1`

## 0.1.3

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 0.1.2

- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

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
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";

function FieldWithIconToggle() {
  return (
    <PasswordToggleField.Root>
      <PasswordToggleField.Input />
      <PasswordToggleField.Toggle>
        <PasswordToggleField.Icon
          visible={<EyeOpenIcon />}
          hidden={<EyeClosedIcon />}
        />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}

function FieldWithTextToggle() {
  return (
    <PasswordToggleField.Root>
      <PasswordToggleField.Input />
      <PasswordToggleField.Toggle>
        <PasswordToggleField.Slot
          visible="Hide password"
          hidden="Show password"
        />
      </PasswordToggleField.Toggle>
    </PasswordToggleField.Root>
  );
}
```

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`
