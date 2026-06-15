# @radix-ui/react-select

## 2.3.1

- Allowed a `Select.Item` with an empty string value to act as a "clear" option. Selecting it resets the selection back to the placeholder, restoring the native `<select>` behavior for optional selects.
- Fixed a bug where typeahead search resulted in focusing an element that no longer exists.
- Updated dependencies: `@radix-ui/react-slot@1.3.0`, `@radix-ui/react-popper@1.3.1`, `@radix-ui/react-dismissable-layer@1.1.13`, `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`, `@radix-ui/react-focus-scope@1.1.10`, `@radix-ui/react-portal@1.1.12`, `@radix-ui/react-visually-hidden@1.2.6`

## 2.3.0

- Added unstable `Provider` and `BubbleInput` parts to Select. `Select.unstable_Provider` sets up Select's context and state without implicitly rendering the hidden native `select`, and `Select.unstable_BubbleInput` exposes that previously internal native `select` so consumers can recompose it explicitly. `Select` continues to render both by default.
- Added support for presence-based exit animations in Select
- Fixed Select hidden input so it submits empty string when no value is selected
- Fixed placeholder rendering when a controlled Select is reset to an empty value
- Added missing `__selectScope` prop to `PopperContent` component
- Fixed `Select` closing unexpectedly after touch-scrolling its content when rendered inside an open shadow DOM
- Fixed a bug where iOS text selection and editing on HTML inputs within `react-dialog` were broken
- Fixed triggers referencing a non-existent element via `aria-controls` when their content is removed from the DOM (credit to [@dodomorandi](https://github.com/dodomorandi) for the [original PR](https://github.com/radix-ui/primitives/pull/3243))
- Fixed `SelectValue` logging invalid prop errors when used with both `asChild` and a placeholder
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-popper@1.3.0`, `@radix-ui/react-slot@1.2.5`, `@radix-ui/react-focus-guards@1.1.4`, `@radix-ui/react-dismissable-layer@1.1.12`, `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/number@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-focus-scope@1.1.9`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-portal@1.1.11`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-visually-hidden@1.2.5`

## 2.2.6

- Updated dependencies: `@radix-ui/react-slot@1.2.4`, `@radix-ui/react-popper@1.2.8`, `@radix-ui/react-focus-guards@1.1.3`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-dismissable-layer@1.1.11`, `@radix-ui/react-focus-scope@1.1.8`, `@radix-ui/react-portal@1.1.10`, `@radix-ui/react-visually-hidden@1.2.4`

## 2.2.5

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-visually-hidden@1.2.3`, `@radix-ui/react-focus-scope@1.1.7`, `@radix-ui/react-popper@1.2.7`, `@radix-ui/react-portal@1.1.9`, `@radix-ui/react-slot@1.2.3`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 2.2.4

- Updated dependencies: `@radix-ui/react-slot@1.2.2`, `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-focus-scope@1.1.6`, `@radix-ui/react-popper@1.2.6`, `@radix-ui/react-portal@1.1.8`, `@radix-ui/react-visually-hidden@1.2.2`

## 2.2.3

- Updated dependencies: `@radix-ui/react-slot@1.2.1`, `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-focus-scope@1.1.5`, `@radix-ui/react-popper@1.2.5`, `@radix-ui/react-portal@1.1.7`, `@radix-ui/react-visually-hidden@1.2.1`

## 2.2.2

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 2.2.1

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 2.2.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-visually-hidden@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-dismissable-layer@1.1.7`, `@radix-ui/react-focus-scope@1.1.4`, `@radix-ui/react-popper@1.2.4`, `@radix-ui/react-portal@1.1.6`
