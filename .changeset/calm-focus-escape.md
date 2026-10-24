---
"@radix-ui/react-popover": minor
"radix-ui": minor
---

Added a `loop` prop to `Popover.Content` for non-modal popovers. It defaults to `true`, so focus still wraps around like before. Set `loop={false}` to let Tab move focus out of the popover from its last control instead of wrapping back to the first. Modal popovers are not affected.
