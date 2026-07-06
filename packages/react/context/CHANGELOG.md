# @radix-ui/react-context

## 1.2.0

### > IMPORTANT: `@radix-ui/react-context` is marked for a minor release since it introduces additive overloaded types and function arguments. At release time, changesets will determine that its dependents should also be marked for a minor release, but this is not the case since it the only change for those packages impacts internal usage. In `radix-ui` this export is exposed from the `internal` module, whose exports do not impact public API and therefore do not follow semver.

Fixed runtime errors for `Form.Message`, `Form.Control`, `Form.Label` and `Form.ValidityState` that are correctly rendered outside of `Form.Field` components

### Other updates

## 1.1.4

- Added repository.directory to all package.json files

## 1.1.3

- Added `displayName` to context objects
