# @radix-ui/react-navigation-menu

## 1.3.0

- Added a `disableToggle` prop to `NavigationMenu.Sub`.
  - `true`: Clicking the trigger of an already-open submenu item keeps it open. This is the default and matches existing behavior.
  - `false`: Clicking the trigger of a submenu item toggles it open or closed.
- Added an `activationMode` prop to `NavigationMenu.Root` and `NavigationMenu.Sub`.
  - `"automatic"`: Hovering or focusing a trigger opens its item, and moving away from the trigger closes it after a short delay. This is the default and matches existing behavior.
  - `"manual"`: Pointer entry and focus never open an item. The item opens when its trigger is clicked.
  - When `activationMode` is omitted on `NavigationMenu.Sub`, it inherits the value from the parent `NavigationMenu.Root`, so setting `"manual"` on the root also applies to submenus unless a submenu opts back in to `"automatic"`.
- Fixed a bug where a submenu's `defaultValue` was reset when an external element was focused before the menu opened.
- Fixed a bug where `NavigationMenu.Viewport` discarded its children and rendered the active content in their place. The active content is now rendered inside the consumer's element alongside any children it already had.
- Updated dependencies: `@radix-ui/react-slot@1.4.0`, `@radix-ui/react-dismissable-layer@1.1.20`, `@radix-ui/react-visually-hidden@1.2.12`, `@radix-ui/react-direction@1.1.5`, `@radix-ui/react-primitive@2.1.11`, `@radix-ui/react-presence@1.1.11`, `@radix-ui/react-collection@1.1.16`

## 1.2.22

- Reverted breaking changes that caused compatibility issues with React Server Components.
- Updated dependencies: `@radix-ui/react-collection@1.1.15`, `@radix-ui/react-compose-refs@1.1.5`, `@radix-ui/react-context@1.2.2`, `@radix-ui/react-direction@1.1.4`, `@radix-ui/react-dismissable-layer@1.1.19`, `@radix-ui/react-id@1.1.4`, `@radix-ui/react-presence@1.1.10`, `@radix-ui/react-primitive@2.1.10`, `@radix-ui/react-use-callback-ref@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.6`, `@radix-ui/react-use-layout-effect@1.1.4`, `@radix-ui/react-use-previous@1.1.4`, `@radix-ui/react-visually-hidden@1.2.11`

## 1.2.21

- Updated dependencies: `@radix-ui/react-collection@1.1.14`, `@radix-ui/react-primitive@2.1.9`, `@radix-ui/react-dismissable-layer@1.1.18`, `@radix-ui/react-visually-hidden@1.2.10`

## 1.2.20

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-collection@1.1.13`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-direction@1.1.3`, `@radix-ui/react-dismissable-layer@1.1.17`, `@radix-ui/react-id@1.1.3`, `@radix-ui/react-presence@1.1.9`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-callback-ref@1.1.3`, `@radix-ui/react-use-controllable-state@1.2.5`, `@radix-ui/react-use-layout-effect@1.1.3`, `@radix-ui/react-use-previous@1.1.3`, `@radix-ui/react-visually-hidden@1.2.9`

## 1.2.19

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.16`, `@radix-ui/react-presence@1.1.8`, `@radix-ui/react-visually-hidden@1.2.8`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-collection@1.1.12`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-previous@1.1.2`

## 1.2.18

- Added CSS custom properties for item indicators' translate values.
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.15`, `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-presence@1.1.7`, `@radix-ui/react-collection@1.1.12`

## 1.2.17

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-dismissable-layer@1.1.14`, `@radix-ui/react-collection@1.1.11`, `@radix-ui/react-visually-hidden@1.2.7`

## 1.2.16

- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.13`, `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`, `@radix-ui/react-visually-hidden@1.2.6`

## 1.2.15

- Fixed triggers referencing a non-existent element via `aria-controls` when their content is removed from the DOM (credit to [@dodomorandi](https://github.com/dodomorandi) for the [original PR](https://github.com/radix-ui/primitives/pull/3243))
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-dismissable-layer@1.1.12`, `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-visually-hidden@1.2.5`

## 1.2.14

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-dismissable-layer@1.1.11`, `@radix-ui/react-visually-hidden@1.2.4`

## 1.2.13

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-visually-hidden@1.2.3`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.2.12

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-visually-hidden@1.2.2`

## 1.2.11

- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-visually-hidden@1.2.1`

## 1.2.10

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.9

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.8

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.7

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-visually-hidden@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-dismissable-layer@1.1.7`
