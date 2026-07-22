# @radix-ui/react-slot

## 1.3.1

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/primitive@1.1.7`, `@radix-ui/react-compose-refs@1.1.4`

## 1.3.0

### Added generic type arguments for `SlotProps` and `createSlot`

`SlotProps` and `createSlot` now accept generic type arguments to specify the type of element a slot should render, as well as its props.

```tsx
const Slot = createSlot<HTMLButtonElement, MyCustomButtonProps>("Slot");
```

## 1.2.5

- Fixed infinite re-render loop in React 19 caused by `Slot` creating a new ref callback on every render
- Added support for nested `Slottable` via a render prop, so a slotted element can be wrapped while still merging Slot props and refs onto it
- Added repository.directory to all package.json files
- Improved error messages for invalid slot children
- Updated dependencies: `@radix-ui/react-compose-refs@1.1.3`

## 1.2.4

- Fixed an issue with how slot components interact with lazy React components. In the case of a lazy component instance, the resulting promise must be consumed to render the desired component.

## 1.2.3

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Revert slot changes causing errors in server components

## 1.2.2

- Add `use client` to slot entry to prevent RSC errors

## 1.2.1

- Use stable composed refs in SlotClone ([#3477](https://github.com/radix-ui/primitives/pull/3477))
