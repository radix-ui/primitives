# @radix-ui/react-toast

## 1.2.15

### Fixed accessibility issues:

- Removed `aria-hidden` from the focusable element, as these elements are already empty and won't be read by screen readers
- Removed `role=status` from list item element (see [w3.org documentation for List Item](https://www.w3.org/TR/html-aria/#docconformance))
- Remove useless default `aria-atomic` from `role=status`

### Other updates

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-collection@1.1.8`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-dismissable-layer@1.1.11`, `@radix-ui/react-portal@1.1.10`, `@radix-ui/react-visually-hidden@1.2.4`

## 1.2.14

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-visually-hidden@1.2.3`, `@radix-ui/react-portal@1.1.9`, `@radix-ui/react-collection@1.1.7`, `@radix-ui/react-primitive@2.1.3`

## 1.2.13

- Updated dependencies: `@radix-ui/react-collection@1.1.6`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-portal@1.1.8`, `@radix-ui/react-visually-hidden@1.2.2`

## 1.2.12

- Updated dependencies: `@radix-ui/react-collection@1.1.5`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-portal@1.1.7`, `@radix-ui/react-visually-hidden@1.2.1`

## 1.2.11

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.2.10

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.2.9

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.2.8

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-collection@1.1.4`, `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-visually-hidden@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-dismissable-layer@1.1.7`, `@radix-ui/react-portal@1.1.6`
