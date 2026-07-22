# @radix-ui/react-tabs

## 1.1.19

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-direction@1.1.3`, `@radix-ui/react-id@1.1.3`, `@radix-ui/react-presence@1.1.9`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-roving-focus@1.1.17`, `@radix-ui/react-use-controllable-state@1.2.5`

## 1.1.18

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-presence@1.1.8`, `@radix-ui/react-roving-focus@1.1.16`, `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.7`

## 1.1.17

- Fixed menu items, tab triggers, toolbar links, and select items intercepting `Space`/`Enter` keys that originate from focusable descendants.
- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-roving-focus@1.1.15`, `@radix-ui/react-presence@1.1.7`

## 1.1.16

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-roving-focus@1.1.14`

## 1.1.15

- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-roving-focus@1.1.13`

## 1.1.14

- Fixed triggers referencing a non-existent element via `aria-controls` when their content is removed from the DOM (credit to [@dodomorandi](https://github.com/dodomorandi) for the [original PR](https://github.com/radix-ui/primitives/pull/3243))
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-roving-focus@1.1.12`, `@radix-ui/react-use-controllable-state@1.2.3`

## 1.1.13

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-roving-focus@1.1.11`

## 1.1.12

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-roving-focus@1.1.10`, `@radix-ui/react-primitive@2.1.3`

## 1.1.11

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-roving-focus@1.1.9`

## 1.1.10

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-roving-focus@1.1.8`

## 1.1.9

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.1.8

- Updated dependencies: `@radix-ui/react-roving-focus@1.1.7`

## 1.1.7

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`, `@radix-ui/react-roving-focus@1.1.6`

## 1.1.6

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`, `@radix-ui/react-roving-focus@1.1.5`

## 1.1.5

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-roving-focus@1.1.4`, `@radix-ui/react-primitive@2.1.0`
