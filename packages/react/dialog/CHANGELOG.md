# @radix-ui/react-dialog

## 1.1.16

- Fixed disabled pointer events in closed dialogs
- Fixed a bug where iOS text selection and editing on HTML inputs within `react-dialog` were broken
- Fixed triggers referencing a non-existent element via `aria-controls` when their content is removed from the DOM (credit to [@dodomorandi](https://github.com/dodomorandi) for the [original PR](https://github.com/radix-ui/primitives/pull/3243))
- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-presence@1.1.6`, `@radix-ui/react-slot@1.2.5`, `@radix-ui/react-focus-guards@1.1.4`, `@radix-ui/react-dismissable-layer@1.1.12`, `@radix-ui/primitive@1.1.4`, `@radix-ui/react-compose-refs@1.1.3`, `@radix-ui/react-context@1.1.4`, `@radix-ui/react-focus-scope@1.1.9`, `@radix-ui/react-id@1.1.2`, `@radix-ui/react-portal@1.1.11`, `@radix-ui/react-primitive@2.1.5`, `@radix-ui/react-use-controllable-state@1.2.3`

## 1.1.15

- Updated dependencies: `@radix-ui/react-presence@1.1.5`, `@radix-ui/react-slot@1.2.4`, `@radix-ui/react-focus-guards@1.1.3`, `@radix-ui/primitive@1.1.3`, `@radix-ui/react-context@1.1.3`, `@radix-ui/react-primitive@2.1.4`, `@radix-ui/react-dismissable-layer@1.1.11`, `@radix-ui/react-focus-scope@1.1.8`, `@radix-ui/react-portal@1.1.10`

## 1.1.14

- Replace deprecated 'ElementRef' with 'ComponentRef' (#3426)
- Updated dependencies: `@radix-ui/react-dismissable-layer@1.1.10`, `@radix-ui/react-focus-scope@1.1.7`, `@radix-ui/react-portal@1.1.9`, `@radix-ui/react-slot@1.2.3`, `@radix-ui/react-primitive@2.1.3`

## 1.1.13

- Updated dependencies: `@radix-ui/react-slot@1.2.2`, `@radix-ui/react-primitive@2.1.2`, `@radix-ui/react-dismissable-layer@1.1.9`, `@radix-ui/react-focus-scope@1.1.6`, `@radix-ui/react-portal@1.1.8`

## 1.1.12

- Updated dependencies: `@radix-ui/react-slot@1.2.1`, `@radix-ui/react-primitive@2.1.1`, `@radix-ui/react-dismissable-layer@1.1.8`, `@radix-ui/react-focus-scope@1.1.5`, `@radix-ui/react-portal@1.1.7`

## 1.1.11

- Updated dependencies: `@radix-ui/react-presence@1.1.4`

## 1.1.10

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.2`

## 1.1.9

- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.1`

## 1.1.8

- Minor improvements to `useControllableState` to enhance performance, reduce surface area for bugs, and log warnings when misused (#3455)
- Updated dependencies: `@radix-ui/react-use-controllable-state@1.2.0`, `@radix-ui/react-primitive@2.1.0`, `@radix-ui/react-dismissable-layer@1.1.7`, `@radix-ui/react-focus-scope@1.1.4`, `@radix-ui/react-portal@1.1.6`
