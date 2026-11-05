---
"@radix-ui/react-dismissable-layer": patch
"radix-ui": patch
---

Fix Escape being ignored when the top layer registered after its last render. The top layer is now decided from the live layer set when the key is pressed.
