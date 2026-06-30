# @radix-ui/react-use-escape-keydown

## 1.1.3

### - Fixed infinite re-render loop in React 19 caused by unstable composed ref callbacks being recreated on every render.

- Deprecated `useEscapeKeydown` in favor of attaching listeners directly via `useEffect` for more granular control over how callbacks are stabilized, when to detach listeners, etc.

### Other updates

## 1.1.2

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-use-callback-ref@1.1.2`
