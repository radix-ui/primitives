# @radix-ui/react-slot

## 1.2.4

- Fixed an issue with how slot components interact with lazy React components. In the case of a lazy component instance, the resulting promise must be consumed to render the desired component.

## 1.2.3

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Revert slot changes causing errors in server components

## 1.2.2

- Add `use client` to slot entry to prevent RSC errors

## 1.2.1

- Use stable composed refs in SlotClone ([#3477](https://github.com/radix-ui/primitives/pull/3477))
