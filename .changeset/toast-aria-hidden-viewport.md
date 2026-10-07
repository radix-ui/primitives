---
"@radix-ui/react-toast": patch
---

Keep the toast viewport out of a modal layer's `aria-hidden` subtree

When a modal `Dialog` (or `Popover`/`Select`/`Menu`) is open, it marks everything outside its content as `aria-hidden` via `aria-hidden`'s `hideOthers`. The toast viewport renders outside that content but stays pointer-interactive, so its contents (e.g. an `Undo` action) were reachable by mouse yet hidden from assistive technology. Marking the viewport as a live-region container (`aria-live="off"`, the default politeness) keeps `hideOthers` from hiding it, so the two agree again.
