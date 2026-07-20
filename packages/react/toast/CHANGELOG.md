# @radix-ui/react-toast

## 1.2.20

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fixed `Toast` removing non-focused toasts when pressing `Escape`.
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.16`, `@radix-ui/react-portal@1.1.14`, `@radix-ui/react-presence@1.1.8`, `@radix-ui/react-visually-hidden@1.2.8`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-collection@1.1.12`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-layout-effect@1.1.2`

## 1.2.19

- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.15`, `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-presence@1.1.7`, `@radix-ui/react-collection@1.1.12`

## 1.2.18

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.
- Cleared the close timer on unmount to prevent memory leaks and errors in test environments
- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-dismissable-layer@1.1.14`, `@radix-ui/react-collection@1.1.11`, `@radix-ui/react-portal@1.1.13`, `@radix-ui/react-visually-hidden@1.2.7`

## 1.2.17

- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.13`, `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`, `@radix-ui/react-portal@1.1.12`, `@radix-ui/react-visually-hidden@1.2.6`

## 1.2.16

- Allow to specify container for ToastAnnounce
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-dismissable-layer@1.1.12`, `@radix-ui/react-collection@1.1.9`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-portal@1.1.11`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-visually-hidden@1.2.5`

## 1.2.15

### Fixed accessibility issues:

- Removed `aria-hidden` from the focusable element, as these elements are already empty and won't be read by screen readers
- Removed `role=status` from list item element (see [w3.org documentation for List Item](https://www.w3.org/TR/html-aria/#docconformance))
- Remove useless default `aria-atomic` from `role=status`

### Other updates

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-dismissable-layer@1.1.11`, `@radix-ui/react-portal@1.1.10`, `@radix-ui/react-visually-hidden@1.2.4`

## 1.2.14

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-visually-hidden@1.2.3`, `@radix-ui/react-portal@1.1.9`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.2.13

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-portal@1.1.8`, `@radix-ui/react-visually-hidden@1.2.2`

## 1.2.12

- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-portal@1.1.7`, `@radix-ui/react-visually-hidden@1.2.1`

## 1.2.11

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.10

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.9

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.8

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-visually-hidden@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-dismissable-layer@1.1.7`, `@radix-ui/react-portal@1.1.6`
