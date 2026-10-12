---
"@radix-ui/react-dismissable-layer": patch
"@radix-ui/react-focus-scope": patch
"@radix-ui/react-use-escape-keydown": patch
"radix-ui": patch
---

Fixed Escape and Tab being handled while an input method (IME) composition is open. On macOS the browser reports the real key for a keystroke the IME consumed (Chromium sends `key: "Escape"` with `isComposing: true`; Safari sends it after `compositionend` with `keyCode` 229), so pressing Escape to cancel a Japanese, Chinese or Korean conversion dismissed the whole Dialog, Popover or Menu and discarded the text, and a Tab the IME used moved focus out of the composing input. Keydowns with `isComposing` or `keyCode` 229 are now left to the input method.
