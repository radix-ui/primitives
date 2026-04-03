---
'@radix-ui/react-dialog': patch
---

Fix scroll lock not being released when Dialog is forcefully unmounted during SPA navigation. Added a `useLayoutEffect` cleanup in `DialogOverlayImpl` that synchronously removes `data-scroll-locked` from `document.body` when the overlay unmounts while the dialog is still open (e.g. route change triggered by a Link inside the Dialog).
