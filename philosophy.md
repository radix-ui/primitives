# Primitives: Philosophy and Guiding Principles

TODO: Overview statement on motivation and philosphy of the project

## Primary considerations at a glance

1. Accessibility
2. Composability
3. Customizability

---

## Primary considerations

### Accessibility

- Components follow ARIA design patterns where they exist; where they don't, prior research is done to determine the patterns and behaviors we adopt when designing a new component
- Developers should know about accessibility but shouldn't have to spend too much time implementing
  accessible patterns
- Most behavior and markup related to accessibility should be abstracted, and bits that can't should be simplified where possible
- Individual components will be tested to ensure maximum accessibility, but where app context is required the component library should provide useful guidance and supporting materials where possible to build fully accessible applications
- Try to name things as closely to `aria` and `html` as possible where applicable; wherever we require developers to engage with accessibility directly, our platform should be a learning opportunity and a bridge for better understanding the underlying problems we solve
- Components are thoroughly tested on a variety of devices and assistive technology, including all major screen reader vendors (VoiceOver, JAWS, NVDA); components respond and adapt effectively to input and appearance distinctions between platforms

### Composability

- An open component API provides developers with direct access to the underlying DOM node that a component ultimately renders
- We achieve this API with a 1-to-1 strategy, where a single component only renders a single DOM element (if a DOM node is rendered at all)
- Some abstractions may require slight deviation from this pattern, in which case the rationale should be clearly explained in supporting documentation
- This API also empowers us to forward user-provided DOM refs to the correct underlying DOM node without doing anything too clever, meaning refs function exactly as the user would expect them to
- Just as DOM nodes are composable, so are DOM event handlers; consumers should be able to pass their own event handlers directly to a component and stop internal handlers from firing

### Customizability

- Our components can be composed or styled the same way underlying JSX components are composed or styled, with limitations only introduced to prevent UX/accessibility dark patterns where needed
- Components are style agnostic, but they ship with default JS style objects that provide the bare minimal styles needed to reset user agent styles and present a basic, visually sensible control
- Consumers can choose how to apply these styles in their app with plain CSS, CSS-in-JS, or pass them directly as inline styles
- Consumers can also opt to exclude our default styles altogether and write their own however they see fit
- As each component that renders to the DOM will render only one element, we can provide predictable prefixed DOM attributes that can be used as CSS selectors:

| Component       | Rendered element                    |
| --------------- | ----------------------------------- |
| `<Avatar />`    | `<div data-interop-avatar="" />`    |
| `<Tabs />`      | `<div data-interop-tabs="" />`      |
| `<Tabs.List />` | `<div data-interop-tabs-list="" />` |

## Other considerations

### Internationalization

- Components support international string formatting and make behavioral adjustments for right-to-left languages

### Stateful components can be controlled or uncontrolled

- Similar to form field JSX elements in React, all components with internal state can either be uncontrolled (internally managed) or controlled (managed by the consumer)

### Components exist in a finite number of predefined states

- State in this context refers to a component's state representable by a finite state machine; not to be confused with arbitrary stateful data as typically referenced in React libraries
- States are predetermined during the component design phase and expressed as strings in component code, making state transitions more explicit, deterministic, and clearer to follow
- Use the `data-state` attribute to expose a component's state directly to its DOM element
- When tempted to use a boolean to track a piece of stateful data, consider enumerated strings instead

### Developer experience

- Component APIs should be relatively intuitive and as declarative as possible
- Provide in-code documentation for complex/unclear abstractions for easier source debugging
- Anticipate errors and provide thorough console warnings with links back to documentation

### Balancing tradeoffs between design goals

- Composition is preferred over configuration
- Code clarity is preferred over bundle terseness except in extreme cases
- Smart abstractions preferred over over-exposing internal state

### Documentation

TODO

### Misc

- Not concerned with design system components like `Box`, `Chip` or `Badge` that provide visual language consistency but provide no underlying semantic meaning or abstracted behavior
- Keep file structure flat so logic is easier to follow; avoid early abstractions
- Don't repeat yourself _too much_ but don't be afraid to repeat yourself if an implementation detail hasn't been thoroughly vetted
