---
'@radix-ui/react-menu': minor
'@radix-ui/react-dropdown-menu': minor
'@radix-ui/react-context-menu': minor
'@radix-ui/react-menubar': minor
---

Add `focusOnItemEnter` prop to `Menu.Content` (and `DropdownMenu.Content`, `ContextMenu.Content`, `Menubar.Content`).

Default `true` — preserves existing behaviour where moving the pointer over an item focuses it (matches native menu UX).

Set to `false` when the menu contains focusable siblings (e.g. an embedded search `<input>`) that the user may want to keep typing in without their caret being stolen by every row the pointer passes over. Submenu hover-open is unaffected — submenu opening is driven by `onItemEnter` (pointer grace intent), not by the focus call.

```jsx
<DropdownMenu.Content focusOnItemEnter={false}>
  <input type="text" placeholder="Filter…" />
  <DropdownMenu.Item>Item 1</DropdownMenu.Item>
  <DropdownMenu.Item>Item 2</DropdownMenu.Item>
</DropdownMenu.Content>
```

Fixes https://github.com/radix-ui/primitives/issues/2193
