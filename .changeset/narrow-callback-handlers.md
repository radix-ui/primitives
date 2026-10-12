---
'@radix-ui/react-accordion': patch
'@radix-ui/react-avatar': patch
'@radix-ui/react-checkbox': patch
'@radix-ui/react-collapsible': patch
'@radix-ui/react-context-menu': patch
'@radix-ui/react-dialog': patch
'@radix-ui/react-dismissable-layer': patch
'@radix-ui/react-dropdown-menu': patch
'@radix-ui/react-focus-scope': patch
'@radix-ui/react-hover-card': patch
'@radix-ui/react-menu': patch
'@radix-ui/react-menubar': patch
'@radix-ui/react-navigation-menu': patch
'@radix-ui/react-one-time-password-field': patch
'@radix-ui/react-password-toggle-field': patch
'@radix-ui/react-popover': patch
'@radix-ui/react-progress': patch
'@radix-ui/react-roving-focus': patch
'@radix-ui/react-select': patch
'@radix-ui/react-slider': patch
'@radix-ui/react-switch': patch
'@radix-ui/react-tabs': patch
'@radix-ui/react-toast': patch
'@radix-ui/react-toggle': patch
'@radix-ui/react-toggle-group': patch
'@radix-ui/react-tooltip': patch
'radix-ui': patch
---

Fixed a type regression where callback props that were previously declared as methods rejected handlers whose parameter is narrower than the prop's.
