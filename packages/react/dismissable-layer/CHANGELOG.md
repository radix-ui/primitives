# @radix-ui/react-dismissable-layer

## 1.1.15

- Fixed a bug causing background nested popovers to close all layers on outside click
- Fixed stale `onEscapeKeyDown`/`onDismiss` handlers on React 19.2. The escape key handling now stabilizes via `useCallbackRef` instead of the native `useEffectEvent`, which returns a stale closure inside `forwardRef` components on React 19.2.x.
- Fixed a regression in Dismissable Layer originating from a [bug in React's `useEffectEvent`](https://github.com/react/react/pull/34831).
- Updated dependencies: `@radix-ui/primitive@1.1.5`

## 1.1.14

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.1.13

- Fixed Dismissable Layer so outside interactions stopped by extension UI overlays do not dismiss dialogs or popovers.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.1.12

- Fixed a bug where iOS text selection and editing on HTML inputs within `react-dialog` were broken
- Fixed `pointer-events: none` being left on the `body` after closing when multiple overlapping modal layers
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-escape-keydown@1.1.2`

## 1.1.11

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.1.10

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.1.9

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.1.8

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.1.7

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
