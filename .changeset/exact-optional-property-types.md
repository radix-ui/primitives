---
"@radix-ui/primitive": minor
"@radix-ui/react-accessible-icon": minor
"@radix-ui/react-accordion": minor
"@radix-ui/react-alert-dialog": minor
"@radix-ui/react-announce": minor
"@radix-ui/react-aspect-ratio": minor
"@radix-ui/react-avatar": minor
"@radix-ui/react-checkbox": minor
"@radix-ui/react-collapsible": minor
"@radix-ui/react-collection": minor
"@radix-ui/react-context": minor
"@radix-ui/react-context-menu": minor
"@radix-ui/react-dialog": minor
"@radix-ui/react-direction": minor
"@radix-ui/react-dismissable-layer": minor
"@radix-ui/react-dropdown-menu": minor
"@radix-ui/react-focus-guards": minor
"@radix-ui/react-focus-scope": minor
"@radix-ui/react-form": minor
"@radix-ui/react-hover-card": minor
"@radix-ui/react-menu": minor
"@radix-ui/react-menubar": minor
"@radix-ui/react-navigation-menu": minor
"@radix-ui/react-one-time-password-field": minor
"@radix-ui/react-password-toggle-field": minor
"@radix-ui/react-popover": minor
"@radix-ui/react-popper": minor
"@radix-ui/react-portal": minor
"@radix-ui/react-primitive": minor
"@radix-ui/react-progress": minor
"@radix-ui/react-radio-group": minor
"@radix-ui/react-roving-focus": minor
"@radix-ui/react-scroll-area": minor
"@radix-ui/react-select": minor
"@radix-ui/react-separator": minor
"@radix-ui/react-slider": minor
"@radix-ui/react-slot": minor
"@radix-ui/react-switch": minor
"@radix-ui/react-tabs": minor
"@radix-ui/react-toast": minor
"@radix-ui/react-toggle": minor
"@radix-ui/react-toggle-group": minor
"@radix-ui/react-toolbar": minor
"@radix-ui/react-tooltip": minor
"@radix-ui/react-use-controllable-state": minor
"radix-ui": minor
---

Enabled TypeScript's `exactOptionalPropertyTypes` across the repo and made the public API compatible with it. Optional props are now declared as `prop?: T | undefined`, so consumers compiling with that flag can forward a possibly-`undefined` value straight into a prop (`<Dialog.Root open={maybeOpen}>`) instead of having to strip the key first.

Note for consumers already passing a handler whose parameter type is narrower than the prop's: optional callbacks were declared with method shorthand, which TypeScript checks bivariantly. Attaching `| undefined` requires property syntax, which is checked contravariantly, so such handlers are now rejected. For example a `Slider` `onValueChange={([value]: [number]) => …}` must become `onValueChange={(values: number[]) => …}`.
