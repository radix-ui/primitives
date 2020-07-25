# `primitives`

These packages will define the primitive behaviors and display logic for our rendered components.

```
[primitive]/src
-- dict.ts   # Implementation details
-- state.ts  # State chart
-- index.ts
```

## `dict`

This layer is responsible for defining implementation details for the component specific to the target platforms we support\*. This includes event handlers, required DOM attributes, and certain internal abstractions that can be consumed by other layers in the primitive.

_\* For now, this means the DOM, but in the future we may decide to support native platforms and provide dictionaries for them as well._

A simplified example for a basic button component might look something like this. **Note: this is entirely conceptual at this point and the exact implementation will likely look very different.**

```ts
enum ButtonParts {
  // Our button has only one part.
  // We give it a constant reference name.
  Button = 'Button',
}

// Our button has some props. While these can be used
// by our React components, these should not always be
// considered the place to define our React props.
// These are common properties that can be referenced
// by any framework we choose to support.
type ButtonProps = {
  // The button's mode for behavior
  mode: 'standard' | 'toggle' | 'menu';
  // If the button controls another component/element,
  // we need a reference to it
  controlledRefId: string;
  // A callback for buttons in `toggle` mode.
  onToggle(state: 'on' | 'off'): void;
  // The toggle state for buttons in `toggle` mode.
  toggleState: 'on' | 'off';
  // Identifies the instance that it will be rendered
  // as a "fake" button, meaning that we may need
  // certain attributes shimmed for accessibility.
  fauxButton: boolean;
};

const ButtonDomDictionary = {
  // Define all parts.
  // In this case, we only have one.
  button: {
    displayName: ButtonParts.Button,
    // We may find some internal abstractions useful.
    // The `type` here suggests that this part is at
    // the root of our component tree. This may not be
    // very important for the button, but in compound
    // components a root might provide context to
    // subcomponents lower in the tree. In React, this
    // is useful because we have a way to handle context
    // consistently across the board and we can use
    // this type to identify the need for a context
    // provider.
    type: PartTypes.Root,
    // The HTML tag that will be rendered to the DOM.
    // In some cases parts may not render directly,
    // so we should be able to pass `null` here.
    tagName: 'button',
    // Any default values for our props.
    defaultProps: {
      mode: 'standard',
    },
    // DOM attributes
    attrs: {
      role: ({ props }) => (props.fauxButton ? 'button' : undefined),
      tabindex: ({ props }) => (props.fauxButton ? 0 : undefined),
      'aria-pressed': ({ props, state }) =>
        props.mode === 'toggle' ? (state.toggled === 'on' ? true : false) : undefined,
      'aria-haspopup': ({ props }) => (props.mode === 'menu' ? true : undefined),
      'aria-controls': ({ props }) => props.controlledRefId || undefined,
      'aria-expanded': ({ props, state }) =>
        props.mode !== 'normal' ? (state.toggled === 'on' ? true : false) : undefined,
    },
    // DOM event handlers
    events: {
      onKeyDown({ props, parts }) {
        return props.fauxButton
          ? function onKeyDown(event) {
              if (event.key === ' ' || event.key === 'Enter') {
                parts.button.element.click();
              }
            }
          : undefined;
      },
    },
  },
};
```

## `state`

This layer defines the component's state as a state chart that can be consumed by our state machine. It should be platform agnostic, ideally. Not all components have state and thus not all components will have a state chart.

## Implementation example

TODO
