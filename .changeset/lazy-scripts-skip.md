---
"@radix-ui/primitive": patch
"@radix-ui/react-alert-dialog": patch
"@radix-ui/react-context-menu": patch
"@radix-ui/react-dialog": patch
"@radix-ui/react-dropdown-menu": patch
"@radix-ui/react-menu": patch
"@radix-ui/react-menubar": patch
"@radix-ui/react-popover": patch
"@radix-ui/react-select": patch
"radix-ui": patch
---

Improved the performance of hiding content outside of modal components. Elements that are never rendered are no longer marked, and `<script>` elements no longer prevent their ancestors from being hidden.
