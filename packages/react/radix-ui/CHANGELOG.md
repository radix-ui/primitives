# radix-ui

## 1.5.0

- Add unstable `Provider` and `BubbleInput` parts to Select. `Select.unstable_Provider` sets up Select's context and state without implicitly rendering the hidden native `select`, and `Select.unstable_BubbleInput` exposes that previously internal native `select` so consumers can recompose it explicitly. `Select` continues to render both by default.
- Added support for presence-based exit animations in Select
- Fixed Select hidden input so it submits empty string when no value is selected
- Add unstable `Provider`, `Trigger` and `BubbleInput` parts to Switch. These expose the previously internal composition (context provider, the interactive control, and the hidden form input) so consumers can directly access and recompose them. The `Switch` component continues to render them by default.
- Added support for a controlled `open` prop on `ContextMenu.Root`. This is intended for reading the open state and closing the menu programmatically, though we discourage opening the menu programmatically since opening the menu depends on user interaction to position the menu.
- Add unstable `ThumbProvider`, `ThumbTrigger`, and `BubbleInput` parts to Slider. `SliderThumb` was previously a single component that implicitly rendered a hidden native input for form submission. It is now composed from these new parts, which are exposed so consumers can decouple the bubble input from the thumb (for example, to render or customize it independently) instead of relying on `SliderThumb` to render it implicitly. `SliderThumb` continues to render all three by default, so existing usage is unaffected.
- Add unstable `RadioGroupItemProvider`, `RadioGroupItemTrigger` and `RadioGroupItemBubbleInput` parts. These expose the previously internal composition of a radio item (context provider, the interactive control, and the hidden form input) so consumers can directly access and recompose them. The `RadioGroupItem` component continues to render them by default.
- Fixed a "Maximum update depth exceeded" infinite loop in React 19 that could occur when `Presence` was given a child with an unstable ref.
- Fixed Popper bug resulting in max-update depth exceeded error for pages with large number of popper instances
- Fixed a performance bottleneck where opening an overlay re-scanned the document and re-inserted the focus guards on every mount, forcing a synchronous reflow. The shared guard pair is now cached and only written to the DOM when their edge position actually changes.
- Fixed a bug where iOS text selection and editing on HTML inputs within `react-dialog` were broken
- Fixed bug in context menu where submenu's stayed expanded after re-opening on long-press touch events
- Added `focusVisible` to for non-keyboard interactions with slider thumbs for progressively enabling styles using `:focus-visible` alongside programmatic focus management
- Fixed triggers referencing a non-existent element via `aria-controls` when their content is removed from the DOM
- Fixed runtime error when event target is non-Node
- Fixed `SelectValue` logging invalid prop errors when used with both `asChild` and a placeholder
- Fixed a Slider bug where very small `step` values made the thumbs unresponsive
- Fixed a Tooltip bug so that `skipDelayDuration={0}` works as expected. Previously, the open delay could still be skipped when moving between triggers.
- Added repository.directory to all package.json files
- Fixed pasting into One-Time Password Field in environments that do not support the legacy `"Text"` clipboard format by reading the pasted value as `"text/plain"`
- Updated dependencies: `@radix-ui/react-select@2.3.0`, `@radix-ui/react-one-time-password-field@0.1.9`, `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-dialog@1.1.16`, `@radix-ui/react-popper@1.3.0`, `@radix-ui/react-switch@1.3.0`, `@radix-ui/react-context-menu@2.3.0`, `@radix-ui/react-slot@1.2.5`, `@radix-ui/react-scroll-area@1.2.11`, `@radix-ui/react-focus-guards@1.1.4`, `@radix-ui/react-toast@1.2.16`, `@radix-ui/react-dismissable-layer@1.1.12`, `@radix-ui/react-popover@1.1.16`, `@radix-ui/react-menu@2.1.17`, `@radix-ui/react-slider@1.4.0`, `@radix-ui/react-collapsible@1.1.13`, `@radix-ui/react-navigation-menu@1.2.15`, `@radix-ui/react-tabs@1.1.14`, `@radix-ui/react-tooltip@1.2.9`, `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-accessible-icon@1.1.9`, `@radix-ui/react-accordion@1.2.13`, `@radix-ui/react-alert-dialog@1.1.16`, `@radix-ui/react-arrow@1.1.9`, `@radix-ui/react-aspect-ratio@1.1.9`, `@radix-ui/react-avatar@1.1.12`, `@radix-ui/react-checkbox@1.3.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-dropdown-menu@2.1.17`, `@radix-ui/react-focus-scope@1.1.9`, `@radix-ui/react-form@0.1.9`, `@radix-ui/react-hover-card@1.1.16`, `@radix-ui/react-label@2.1.9`, `@radix-ui/react-menubar@1.1.17`, `@radix-ui/react-password-toggle-field@0.1.4`, `@radix-ui/react-portal@1.1.11`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-progress@1.1.9`, `@radix-ui/react-radio-group@1.4.0`, `@radix-ui/react-roving-focus@1.1.12`, `@radix-ui/react-separator@1.1.9`, `@radix-ui/react-toggle@1.1.11`, `@radix-ui/react-toggle-group@1.1.12`, `@radix-ui/react-toolbar@1.1.12`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-effect-event@0.0.3`, `@radix-ui/react-use-escape-keydown@1.1.2`, `@radix-ui/react-use-is-hydrated@0.1.1`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-size@1.1.2`, `@radix-ui/react-visually-hidden@1.2.5`

## 1.4.3

### One-Time Password Field

- Fixed a bug so that all input elements are disabled when the `Root` component is disabled
- Fixed a bug with iOS Chrome autocomplete (#3641)

### Popper

- Fixed a bug causing infinite render loops

### Presence

- Ensured that the `animationend` event is handled correctly when the keyframe has escapable characters (#2763)

### Slot

- Fixed an issue with how slot components interact with lazy React components in React 19. In the case of a lazy component instance, the resulting promise must be consumed to render the desired component.

### Toast

- Fixed several accessibility issues:
  - Removed `aria-hidden` from the focusable element, as these elements are already empty and won't be read by screen readers
  - Removed `role=status` from list item element (see [w3.org documentation for List Item](https://www.w3.org/TR/html-aria/#docconformance))
  - Remove useless default `aria-atomic` from `role=status`

### Other changes

- Added `displayName` to internal context objects for improved debugging

## 1.4.2

- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-navigation-menu@1.2.13`, `@radix-ui/react-visually-hidden@1.2.3`, `@radix-ui/react-dropdown-menu@2.1.15`, `@radix-ui/react-alert-dialog@1.1.14`, `@radix-ui/react-aspect-ratio@1.1.7`, `@radix-ui/react-context-menu@2.2.15`, `@radix-ui/react-roving-focus@1.1.10`, `@radix-ui/react-toggle-group@1.1.10`, `@radix-ui/react-collapsible@1.1.11`, `@radix-ui/react-focus-scope@1.1.7`, `@radix-ui/react-radio-group@1.3.7`, `@radix-ui/react-scroll-area@1.2.9`, `@radix-ui/react-hover-card@1.1.14`, `@radix-ui/react-accordion@1.2.11`, `@radix-ui/react-separator@1.1.7`, `@radix-ui/react-checkbox@1.3.2`, `@radix-ui/react-progress@1.1.7`, `@radix-ui/react-menubar@1.1.15`, `@radix-ui/react-popover@1.1.14`, `@radix-ui/react-toolbar@1.1.10`, `@radix-ui/react-tooltip@1.2.7`, `@radix-ui/react-avatar@1.1.10`, `@radix-ui/react-dialog@1.1.14`, `@radix-ui/react-popper@1.2.7`, `@radix-ui/react-portal@1.1.9`, `@radix-ui/react-select@2.2.5`, `@radix-ui/react-slider@1.3.5`, `@radix-ui/react-switch@1.2.5`, `@radix-ui/react-toggle@1.1.9`, `@radix-ui/react-arrow@1.1.7`, `@radix-ui/react-label@2.1.7`, `@radix-ui/react-toast@1.2.14`, `@radix-ui/react-form@0.1.7`, `@radix-ui/react-menu@2.1.15`, `@radix-ui/react-slot@1.2.3`, `@radix-ui/react-tabs@1.1.12`, `@radix-ui/react-accessible-icon@1.1.7`, `@radix-ui/react-one-time-password-field@0.1.7`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`, `@radix-ui/react-password-toggle-field@0.1.2`

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
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";

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
