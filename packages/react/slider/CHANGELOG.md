# @radix-ui/react-slider

## 1.4.5

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/number@1.1.3`, `@radix-ui/primitive@1.1.7`, `@radix-ui/react-collection@1.1.13`, `@radix-ui/react-compose-refs@1.1.4`, `@radix-ui/react-context@1.2.1`, `@radix-ui/react-direction@1.1.3`, `@radix-ui/react-primitive@2.1.8`, `@radix-ui/react-use-controllable-state@1.2.5`, `@radix-ui/react-use-layout-effect@1.1.3`, `@radix-ui/react-use-previous@1.1.3`, `@radix-ui/react-use-size@1.1.3`

## 1.4.4

- Fixed a bug where `onValueCommit` was not called when a slider thumb was dragged across another thumb.
- Improved tree-shaking so bundlers can drop unused components. Component parts are now marked `/* @__PURE__ */` and use named render functions instead of `Component.displayName = ...` assignments, which previously prevented dead-code elimination with some bundlers.
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.4`, `@radix-ui/primitive@1.1.6`, `@radix-ui/number@1.1.2`, `@radix-ui/react-collection@1.1.12`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.4.3

- Fixed a bug in form control components to ensure their values are updated when their associated form's is reset. This affects `RadioGroup`, `Slider`, `Select`, and `Switch`.
- Fixed keyboard stepping skipping a valid value when the current value is off the step grid (eg, a `defaultValue` that isn't a multiple of `step` from `min`). Stepping now snaps to the next step-aligned value in the direction of travel, matching native `<input type="range">` behavior.
- Updated dependencies: `@radix-ui/primitive@1.1.5`, `@radix-ui/react-context@1.2.0`, `@radix-ui/react-collection@1.1.12`

## 1.4.2

- Fixed infinite re-render loop in React 19 caused by unstable composed ref callback references.

### Other updates

- Updated dependencies: `@radix-ui/react-primitive@2.1.7`, `@radix-ui/react-collection@1.1.11`

## 1.4.1

- Fixed `Duplicate index signature` errors that surfaced when consuming multiple packages together.
- Updated dependencies: `@radix-ui/react-primitive@2.1.6`, `@radix-ui/react-collection@1.1.10`

## 1.4.0

- Added unstable `ThumbProvider`, `ThumbTrigger`, and `BubbleInput` parts to Slider. `SliderThumb` was previously a single component that implicitly rendered a hidden native input for form submission. It is now composed from these new parts, which are exposed so consumers can decouple the bubble input from the thumb (for example, to render or customize it independently) instead of relying on `SliderThumb` to render it implicitly. `SliderThumb` continues to render all three by default, so existing usage is unaffected.
- Added `focusVisible` for non-keyboard interactions with slider thumbs for progressively enabling styles using `:focus-visible` alongside programmatic focus management
- Fixed Slider focus bugs in scrollable context
- Fixed a Slider bug where very small `step` values made the thumbs unresponsive
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-collection@1.1.9`, `@radix-ui/react-direction@1.1.2`, `@radix-ui/number@1.1.2`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`, `@radix-ui/react-use-layout-effect@1.1.2`, `@radix-ui/react-use-previous@1.1.2`, `@radix-ui/react-use-size@1.1.2`

## 1.3.6

- Updated dependencies: `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`

## 1.3.5

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.3.4

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`

## 1.3.3

- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`

## 1.3.2

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.3.1

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.3.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
