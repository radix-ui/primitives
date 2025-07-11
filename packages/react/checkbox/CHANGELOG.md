# @radix-ui/react-checkbox

## 1.3.2

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-primitive@2.1.3`

## 1.3.1

- Fix type error emitted in build artifacts
- Updated dependencies: `@radix-ui/react-primitive@2.1.2`

## 1.3.0

- Add unstable `Provider`, `Trigger` and `BubbleInput` parts to Checkbox ([#3459](https://github.com/radix-ui/primitives/pull/3459))
- Updated dependencies: `@radix-ui/react-primitive@2.1.1`

## 1.2.3

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.2

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.1

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.0

- All form controls with internal bubble inputs now use the Radix `Primitive` component by default. This will allow us to expose these components directly so users can better control this behavior in the future.
- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`
