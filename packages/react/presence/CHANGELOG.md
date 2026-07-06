# @radix-ui/react-presence

## 1.1.7

- Improved performance by reducing forced reflow in `FocusScope` and `Presence`

## 1.1.6

- Fixed a "Maximum update depth exceeded" infinite loop in React 19 that could occur when `Presence` was given a child with an unstable ref.
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-use-layout-effect@1.1.2`

## 1.1.5

- Ensured that the `animationend` event is handled correctly when the keyframe has escapable characters (#2763)

## 1.1.4

- Fix memory leak in Presence
