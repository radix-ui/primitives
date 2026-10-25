---
"@radix-ui/react-select": patch
"radix-ui": patch
---

Fix `Select`: gate `hideOthers` on positioned state so focus moves into the content before outside elements are aria-hidden (#4250).
