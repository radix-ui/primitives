---
"@radix-ui/react-roving-focus": patch
---

Fixed `RovingFocusGroup` moving focus to an item (and scrolling the page to it) when the browser window or tab regains focus after the group's background was clicked. This affected `RadioGroup`, `Tabs`, `ToggleGroup`, `Toolbar`, `Menubar` and `OneTimePasswordField`.
