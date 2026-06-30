# @radix-ui/react-navigation-menu

## 1.2.17

### - Fixed infinite re-render loop in React 19 caused by unstable composed ref callbacks being recreated on every render.

- Deprecated `useEscapeKeydown` in favor of attaching listeners directly via `useEffect` for more granular control over how callbacks are stabilized, when to detach listeners, etc.

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
