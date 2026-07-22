# radix-ui

## 1.6.5

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.

## 1.6.4

- Fixed a regression where importing primitives from the root `radix-ui` entry point erased every primitive's types to `any`.

## 1.6.3

### Dialog

- Fixed broken ARIA references in Dialogs where title or description elements are not rendered.

### Slider

- Fixed a bug where `onValueCommit` was not called when a slider thumb was dragged across another thumb.

### Toast

- Fixed `Toast` removing non-focused toasts when pressing `Escape`.

### Tooltip

- Fixed a bug where `Tooltip.Content` children were mounted to the DOM twice.

### Other updates

- Fixed overriding inline animation style in `Popper.Content`.
- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Widened `virtualRef` prop type to allow `RefObject<Measurable | null>` in popover components.
- Fixed dev-only checks with conditional exports to drop dev-warnings from production builds.
- Added per-primitive subpath entry points so each primitive can be imported directly, eg. `import { Accordion } from 'radix-ui/accordion'` or `import * as Accordion from 'radix-ui/accordion'`. This mirrors the namespaced exports available from the root `radix-ui` entry point.
- Fixed a bug where updating a `Checkbox`, `Switch`, or `RadioGroup` value programmatically (eg. a "select all" control) while inside a `<form>` would dispatch a `click` event from the hidden bubble input that propagated to ancestor `onClick` handlers.

## 1.6.2

### Other updates

- Added CSS custom properties for Navigation Menu item indicators' translate values.
- Fixed a bug in Dismissable Layer causing background nested popovers to close all layers on outside click
- Fixed runtime errors for `Form.Message`, `Form.Control`, `Form.Label` and `Form.ValidityState` that are correctly rendered outside of `Form.Field` components
- Fixed a bug in form control components to ensure their values are updated when their associated form's is reset. This affects `RadioGroup`, `Slider`, `Select`, and `Switch`.
- Fixed menu items, tab triggers, toolbar links, and select items intercepting `Space`/`Enter` keys that originate from focusable descendants.
- Fixed a bug where calling an event handler without an argument would throw, preventing successive event handlers from being called. This affected all components that accept event handlers with internal implementations.
- Fixed a bug in Context Menu to ensure that the menu properly re-anchors to the latest pointer position when re-triggered in its open state.
- Fixed stale `onEscapeKeyDown`/`onDismiss` handlers on React 19.2.
- Fixed items in a Roving Focus Group not being auto-focused on mount within a Focus Scope component.
- Fixed a regression in Dismissable Layer originating from a [bug in React's `useEffectEvent`](https://github.com/react/react/pull/34831).
- Fixed `--radix-scroll-area-corner-width` and `--radix-scroll-area-corner-height` not resetting to `0` when a corner is removed. Previously these values would stick around and leave a permanent gap on the remaining scrollbar.
- Fixed a bug in Slider where stepping with the keyboard would skip a valid value when the current value is off the step grid. Stepping now snaps to the next step-aligned value in the direction of travel, matching native `<input type="range">` behavior.

## 1.6.1

- Cleared the close timer when unmounting `Toast` components to prevent memory leaks and errors in test environments.
- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.
- Removed global `React.CSSProperties` augmentation from emitted declaration files.

## 1.6.0

```tsx
const Slot = createSlot<HTMLButtonElement, MyCustomButtonProps>("Slot");
```

### Avatar

- Fixed several edge cases with Avatar's loading state
  - An avatar's fallback would not be displayed again if its image component unmounted. This is now fixed.
  - Rendering multiple `Avatar.Image` components per `Avatar.Root` was never supported and results in buggy, unpredictable behavior. We now warn about this in development.
  - Zero-sized images were treated as `loading`, meaning that `onLoadingStatusChange` is never called once loaded. A zero-sized image now triggers an `error` status on load.

### Password Toggle Field

- Renamed misspelled `onVisiblityChange` prop to `onVisibilityChange`.
- Fixed prop type definitions to include `asChild` for all component parts.

### Scroll Area

- Stabilized the viewport style tag unless the nonce changes.

### Slot

- `SlotProps` and `createSlot` now accept generic type arguments to specify the type of element a slot should render, as well as its props.

### Toggle Group

- Updated single-select and multi-select toggle groups to use the `radiogroup` and `toolbar` roles, respectively.

### Select

- Allowed a `Select.Item` with an empty string value to act as a "clear" option. Selecting it resets the selection back to the placeholder, restoring the native `<select>` behavior for optional selects. Previously using an empty string value would throw an error.
- Fixed a bug where typeahead search resulted in focusing an element that no longer exists.

### Other updates

- Fixed a regression in that caused submenu misalignment when using custom portals.
- Removed dev-only warnings for dialogs when title and/or description is not rendered.
- Fixed a bug where menus and submenus remained open after a window loses focus.
- Fixed Dismissable Layer so outside interactions stopped by extension UI overlays do not dismiss dialogs or popovers.
- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.

## 1.5.0

### Context Menu

- Added support for a controlled `open` prop on `ContextMenu.Root`. This is intended for reading the open state and closing the menu programmatically, though we discourage opening the menu programmatically since opening the menu depends on user interaction to position the menu.

  ```tsx
  function ControlledContextMenu() {
    const [open, setOpen] = React.useState(false);
    return (
      <ContextMenu.Root open={open} onOpenChange={setOpen}>
        <ContextMenu.Trigger>Open</ContextMenu.Trigger>
        <ContextMenu.Content>
          <button type="button" onClick={() => setOpen(false)}>
            Close me
          </button>
          <ContextMenu.Item>Item 1</ContextMenu.Item>
          <ContextMenu.Item>Item 2</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    );
  }
  ```

- Fixed a bug in where submenus remained expanded after re-opening on long-press touch events.

### Dialog

- Fixed a bug where iOS text selection and editing on HTML inputs within dialogs were broken.
- Fixed a bug causing disabled pointer events in closed dialogs.

### One-Time Password Field

- Fixed pasting into One-Time Password Field in environments that do not support the legacy `"Text"` clipboard format by reading the pasted value as `"text/plain"`.
- Fixed issues with focus management in React 19.2+.
- Fixed a bug to ensure that pasted values exceeding the field length are truncated.

### Popper

- Fixed a "Maximum update depth exceeded" bug for pages with a large number of popper instances.
- Exposed `data-side` and `data-align` on `PopperAnchor` element

### Presence

- Fixed a "Maximum update depth exceeded" bug in React 19 that could occur when `Presence` was given a child with an unstable ref.

### Radio Group

- Added unstable `RadioGroupItemProvider`, `RadioGroupItemTrigger` and `RadioGroupItemBubbleInput` parts. These expose the previously internal composition of a radio item that included a visually hidden `input` so consumers can directly access and recompose them. The `RadioGroupItem` component continues to render them by default.

  ```tsx
  import { RadioGroup } from "radix-ui";

  function ExampleRadioGroup() {
    return (
      <RadioGroup.Root>
        {["one", "two", "three"].map((value) => (
          <RadioGroup.unstable_ItemProvider key={value} value={value}>
            <RadioGroup.unstable_ItemTrigger>
              <RadioGroup.Indicator />
            </RadioGroup.unstable_ItemTrigger>
            {/* the hidden input is now exposed and can be omitted if not needed */}
            <RadioGroup.unstable_ItemBubbleInput />
          </RadioGroup.unstable_ItemProvider>
        ))}
      </RadioGroup.Root>
    );
  }
  ```

### Select

- Added unstable `Provider` and `BubbleInput` parts to Select. These expose the previously internal composition that included a visually hidden `select` so consumers can directly access and recompose them. `Select` continues to render them by default.

  ```tsx
  import { Select } from "radix-ui";

  function ExampleSelect() {
    return (
      <Select.unstable_Provider>
        <Select.Trigger />
        <Select.Portal />
        {/* the hidden input is now exposed and can be omitted if not needed */}
        <Select.unstable_BubbleInput />
      </Select.unstable_Provider>
    );
  }
  ```

- Added support for presence-based exit animations.
- Fixed the bubble hidden input so that submits an empty string when no value is selected.
- Fixed select closing unexpectedly after touch-scrolling its content when rendered inside an open shadow DOM.
- Fixed `SelectValue` logging invalid prop errors when used with both `asChild` and a placeholder

### Slider

- Added unstable `ThumbProvider`, `ThumbTrigger`, and `BubbleInput` parts to Slider. `SliderThumb` was previously a single component that implicitly rendered a hidden native input for form submission. It is now composed from these new parts, which are exposed so consumers can decouple the visually hidden input from the thumb. `SliderThumb` continues to render them by default.

  ```tsx
  import { Slider } from "radix-ui";

  function ExampleSlider() {
    return (
      <Slider.Root defaultValue={[data.price.min, data.price.max]}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>

        <Slider.unstable_ThumbProvider name="price[min]">
          <Slider.unstable_ThumbTrigger />
          {/* the hidden input is now exposed and can be omitted if not needed */}
          <Slider.unstable_BubbleInput />
        </Slider.unstable_ThumbProvider>

        <Slider.unstable_ThumbProvider name="price[max]">
          <Slider.unstable_ThumbTrigger />
          <Slider.unstable_BubbleInput />
        </Slider.unstable_ThumbProvider>
      </Slider.Root>
    );
  }
  ```

- Added `focusVisible` for non-keyboard interactions with slider thumbs for progressively enabling styles using `:focus-visible` alongside programmatic focus management.
- Fixed a Slider bug where very small `step` values made the thumbs unresponsive.
- Fixed focus bugs for sliders in a scrollable context.

### Slot

- Added support for nested `Slottable` items via a render prop. This allows a slotted element to be wrapped while still merging Slot props and refs onto it.
- Fixed infinite re-render loop in React 19 caused by `Slot` creating a new ref callback on every render.
- Improved error messages for invalid slot children.

### Switch

- Added unstable `Provider`, `Trigger` and `BubbleInput` parts to Switch. These expose the previously internal composition that included a visually hidden `input` so consumers can directly access and recompose them. The `Switch` component continues to render them by default.

  ```tsx
  import { Switch } from "radix-ui";

  function ExampleSwitch() {
    return (
      <Switch.unstable_Provider>
        <Switch.unstable_Trigger>
          <Switch.Thumb />
        </Switch.unstable_Trigger>
        {/* the hidden input is now exposed and can be omitted if not needed */}
        <Switch.unstable_BubbleInput />
      </Switch.unstable_Provider>
    );
  }
  ```

### Tooltip

- Fixed a runtime error when an event target is a non-Node entity.
- Fixed a Tooltip bug so that `skipDelayDuration={0}` works as expected. Previously, the open delay could still be skipped when moving between triggers.

### Other changes

- Use React's built-in `useSyncExternalStore` (React 18+) instead of importing the CJS-only `use-sync-external-store/shim`, with a fallback for React < 18. The shim called `require("react")` at module-evaluation time, which crashed ESM-only browser bundles when importing some components from the `radix-ui` package.
- Fixed triggers referencing a non-existent elements via `aria-controls` when their content is removed from the DOM (credit to [@dodomorandi](https://github.com/dodomorandi) for the [original PR](https://github.com/radix-ui/primitives/pull/3243)).
- Fixed a performance bottleneck where opening an overlay re-scanned the document and re-inserted the focus guards on every mount, forcing a synchronous reflow. The shared guard pair is now cached and only written to the DOM when their edge position actually changes.
- Added missing `use client` directives to modules causing errors in RSC modules.
- Added `align` prop to `Menu.SubContent`.
- Fixed missing `data-state` attribute for Scroll Area scrollbars.
- Allow to specify container for `Toast.Announce`.

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
