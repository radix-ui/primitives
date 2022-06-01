# Primitives: Philosophy and Guiding Principles

## Vision

Most of us share similar definitions for common UI patterns like accordion, checkbox, combobox, dialog, dropdown, select, slider, and tooltip. These UI patterns are [documented by WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#aria_ex) and generally understood by the community.

However, the implementations provided to us by the web platform are inadequate. They're either non-existent, lacking in functionality, or cannot be customised sufficiently.

As a result, developers are forced to build custom components—an incredibly difficult task. As a result, most components on the web are inaccessible, non-performant, and lacking important features.

Our goal is to create a well-funded open-source component library that the community can use to build accessible design systems.

## Principles at a glance

1. Accessible
2. Functional
3. Interoperable
4. Composable
5. Customizable

---

## Principles

### Accessible

- Components adhere to WAI-ARIA guidelines and are tested regularly in a wide selection of modern browsers and assistive technologies.
- Where WAI-ARIA guidelines do not cover a particular use case, prior research is done to determine the patterns and behaviors we adopt when designing a new component. We look to similar, well-tested native solutions to capture nuances that WAI-ARIA guidelines may overlook.
- Developers should know about accessibility but shouldn't have to spend too much time implementing accessible patterns.
- Most behavior and markup related to accessibility should be abstracted, and bits that can't should be simplified where possible.
- Individual components will be tested to ensure maximum accessibility, but where app context is required the component library should provide useful guidance and supporting materials where possible to build fully accessible applications.
- Try to name things as closely to `aria` and `html` as possible where applicable; wherever we require developers to engage with accessibility directly, our platform should be a learning opportunity and a bridge for better understanding the underlying problems we solve.
- Components are thoroughly tested on a variety of devices and assistive technology, including all major screen reader vendors (VoiceOver, JAWS, NVDA); components respond and adapt effectively to input and appearance distinctions between platforms.

### Functional

- Components are feature-rich, with support for keyboard interaction, collision detection, focus trapping, dynamic resizing, scroll locking, native fallbacks, and more.

### Composable

- Components are designed with an open API that provides consumers with direct access to the underlying DOM node that is rendered to the page.
- We achieve this API with a 1-to-1 strategy, where a single component only renders a single DOM element (if a DOM node is rendered at all).
- Some abstractions may require slight deviation from this pattern, in which case the rationale should be clearly explained in supporting documentation.
- This API also empowers us to forward user-provided DOM refs to the correct underlying DOM node without doing anything too clever, meaning refs function exactly as the consumer would expect.
- Just as DOM nodes are composable, so are DOM event handlers; consumers should be able to pass their own event handlers directly to a component and stop internal handlers from firing.

### Customizable

- Components are built to be themed; no need to override opinionated styles, as primitives ship with zero presentational styles applied by default.
- Components ship with CSS-in-JS style objects that provide a minimal set styles needed to easily reset user agent styles and provide a clean slate for consumers to build upon.
- Our components can be composed or styled the same way underlying JSX components are composed or styled, with limitations only introduced to prevent UX/accessibility dark patterns where needed.
- Consumers can choose whether or not to apply these styles in their app, as well as the styling tool; we do not enforce a particular methodology or library.

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
