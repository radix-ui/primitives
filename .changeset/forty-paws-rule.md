---
'@radix-ui/react-dropdown-menu': patch
---

fix(dropdown-menu): open menu on ArrowUp and focus last item (#3640)

According to the W3C APG pattern for menu buttons, pressing ArrowUp on a
focused trigger should open the menu and move focus to the last item.
Previously, ArrowUp was not handled by the trigger at all.

Added ArrowUp handling to DropdownMenuTrigger that opens the menu and
sets a flag so DropdownMenuContent focuses the last item after mount.
