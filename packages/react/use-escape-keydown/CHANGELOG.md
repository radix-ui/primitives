# @radix-ui/react-use-escape-keydown

## 1.1.4

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.
- Updated dependencies: `@radix-ui/react-use-callback-ref@1.1.3`

## 1.1.3

- Deprecated `useEscapeKeydown` in favor of attaching listeners directly via `useEffect` for more granular control over how callbacks are stabilized, when to detach listeners, etc. This package itself will be deprecated in the near future.

### Other updates

## 1.1.2

- Added repository.directory to all package.json files
- Updated dependencies: `@radix-ui/react-use-callback-ref@1.1.2`
