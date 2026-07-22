# @radix-ui/react-popper

## 1.3.5

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-arrow@1.1.13`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-callback-ref@1.1.3`, `@radix-ui/react-use-layout-effect@1.1.3`, `@radix-ui/react-use-rect@1.1.3`, `@radix-ui/react-use-size@1.1.3`, `@radix-ui/rect@1.1.3`

## 1.3.4

- Fixed overriding inline animation style in `Popper.Content`.
- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Fix `virtualRef` prop type to allow `RefObject<Measurable | null>` in popover components.
- Updated dependencies: `@radix-ui/react-arrow@1.1.12`, `@radix-ui/rect@1.1.2`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-rect@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.3.3

- Updated dependencies: `@radix-ui/react-context@1.2.0`

## 1.3.2

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-arrow@1.1.11`

## 1.3.1

- Fixed a regression in Popper that caused submenu misalignment when using custom portals.
- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-arrow@1.1.10`

## 1.3.0

- Exposed `data-side` and `data-align` on `PopperAnchor` element
- Fixed Popper bug resulting in max-update depth exceeded error for pages with large number of popper instances
- Set the `PopperAnchor` DOM anchor from a callback ref instead of an effect so mounting many Popper-based components (Tooltip, Popover, DropdownMenu, HoverCard) at once no longer counts toward React's nested update depth limit and triggers "Maximum update depth exceeded". Virtual anchors continue to be read on every render so a swapped or late-assigned `virtualRef.current` is still picked up.
- Fixed regression when an occluded submenu stays visible with `hideWhenDetached` enabled
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/rect@1.1.2`, `@radix-ui/react-arrow@1.1.9`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-callback-ref@1.1.2`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-rect@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.2.8

- Fixed a bug to prevent infinite render loops
- Updated dependencies: `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-arrow@1.1.8`

## 1.2.7

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-arrow@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.2.6

- Updated dependencies: `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-arrow@1.1.6`

## 1.2.5

- Updated dependencies: `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-arrow@1.1.5`

## 1.2.4

- Updated dependencies: `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-arrow@1.1.4`
