# @radix-ui/react-scroll-area

## 1.2.13

### - Fixed infinite re-render loop in React 19 caused by unstable composed ref callbacks being recreated on every render.

- Deprecated `useEscapeKeydown` in favor of attaching listeners directly via `useEffect` for more granular control over how callbacks are stabilized, when to detach listeners, etc.

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`

## 1.2.12

- Stabilized the viewport style tag unless the nonce changes.
- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`

## 1.2.11

- Fixed missing `data-state` attribute for Scroll Area scrollbars
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/number@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-layout-effect@1.1.2`

## 1.2.10

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`

## 1.2.9

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.2.8

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.2.7

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.2.6

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`
