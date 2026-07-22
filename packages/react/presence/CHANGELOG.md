# @radix-ui/react-presence

## 1.1.9

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-use-layout-effect@1.1.3`

## 1.1.8

- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-use-layout-effect@1.1.2`

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
