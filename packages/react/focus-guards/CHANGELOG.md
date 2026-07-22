# @radix-ui/react-focus-guards

## 1.1.5

- Republish through CI to attach provenance attestations. The previous versions of these packages were published manually outside of CI and therefore shipped without provenance; this patch re-releases the same code through the CI pipeline so every package includes an attestation.

## 1.1.4

- Fixed a performance bottleneck where opening an overlay re-scanned the document and re-inserted the focus guards on every mount, forcing a synchronous reflow. The shared guard pair is now cached and only written to the DOM when their edge position actually changes.
- Added repository.directory to all package.json files

## 1.1.3

- Added internal prop types
