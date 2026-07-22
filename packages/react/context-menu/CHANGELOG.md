# @radix-ui/react-context-menu

## 2.3.5

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-menu@2.1.22`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-controllable-state@1.2.5`

## 2.3.4

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fix dev-only checks with conditional exports to drop dev-warnings from production builds.
- Updated dependencies: `@radix-ui/react-menu@2.1.21`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`

## 2.3.3

- Fixed `ContextMenu` not re-anchoring to the latest pointer position when re-triggered while already open.
- Fixed menu items, tab triggers, toolbar links, and select items intercepting `Space`/`Enter` keys that originate from focusable descendants.
- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-menu@2.1.20`

## 2.3.2

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-menu@2.1.19`

## 2.3.1

- Fixed a bug where menus and submenus remained open after a window loses focus.
- Updated dependencies: `@radix-ui/react-menu@2.1.18`, `@radix-ui/react-primitive@2.1.6`

## 2.3.0

- Added support for a controlled `open` prop on `ContextMenu.Root`. This is intended for reading the open state and closing the menu programmatically, though we discourage opening the menu programmatically since opening the menu depends on user interaction to position the menu.
- Fixed bug in context menu where submenus stayed expanded after re-opening on long-press touch events
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-menu@2.1.17`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`

## 2.2.16

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-menu@2.1.16`, `@radix-ui/react-primitive@2.1.4`

## 2.2.15

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-menu@2.1.15`, `@radix-ui/react-primitive@2.1.3`

## 2.2.14

- Updated dependencies: `@radix-ui/react-menu@2.1.14`, `@radix-ui/react-primitive@2.1.2`

## 2.2.13

- Updated dependencies: `@radix-ui/react-menu@2.1.13`, `@radix-ui/react-primitive@2.1.1`

## 2.2.12

- Updated dependencies: `@radix-ui/react-menu@2.1.12`

## 2.2.11

- Updated dependencies: `@radix-ui/react-menu@2.1.11`

## 2.2.10

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`, `@radix-ui/react-menu@2.1.10`

## 2.2.9

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`, `@radix-ui/react-menu@2.1.9`

## 2.2.8

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-menu@2.1.8`
