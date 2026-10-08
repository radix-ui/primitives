---
"@radix-ui/react-collection": minor
"radix-ui": minor
---

**BREAKING:** Changes to `unstable_createCollection` API:
  - Renamed `unstable_CollectionProps` to `unstable_CollectionSlotProps` and `unstable_CollectionItemMap` to `unstable_CollectionDict`.
  - Added `useGetCollection` to returned functions from `unstable_createCollection`.
  - Fixed display names of the collection context providers returned from `unstable_createCollection`.
