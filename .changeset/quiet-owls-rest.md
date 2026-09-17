---
"@radix-ui/react-focus-scope": patch
"radix-ui": patch
---

Fixed `FocusScope`'s unmount timer reading `document`, `CustomEvent` and `HTMLInputElement` from the global scope, which could throw `TypeError: Failed to execute 'dispatchEvent' on 'EventTarget'` after a test environment (e.g. Vitest + jsdom) had already been torn down. The timer now uses references captured when the scope unmounts.
