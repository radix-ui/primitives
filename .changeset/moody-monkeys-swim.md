---
"@radix-ui/react-avatar": minor
"radix-ui": minor
---

Fixed several edge cases with Avatar's loading state:
- An avatar's fallback would not be displayed again if its image component unmounted. This is now fixed.
- Rendering multiple `Avatar.Image` components per `Avatar.Root` was never supported and results in buggy, unpredictable behavior. We now warn about this in development.
- Zero-sized images were treated as `loading`, meaning that `onLoadingStatusChange` is never called once loaded. A zero-sized image now triggers an `error` status on load.
