- Start Date: 2023-02-17
- RFC PR: (leave this empty, to be filled in later)
- Authors: Benoît Grélard

# React Form primitive

## Summary

This RFC proposes adding a new primitive to Radix UI primitives: `Form`. It will provide an easier way to create forms in React. The goal is to provide a simple, declarative, uncontrolled (but controllable) API (à la Radix) to create forms that includes client-side validation in an accessible manner, as well as handling of server errors accessibly too.

## Motivation

Forms are a huge part of building for the web, and whilst we do offer building blocks for it (things like `Checkbox`, `Select`, etc) we do not yet have an overarching solution for creating accessible forms. This RFC aims to solve that.

Additionally, similarly to how Radix introduced a great out of the box experience for specific components (not having to wire state or refs for example) we see a big opportunity to do the same for forms as this is a space where we see a lot of people struggle or overcomplicate things.

At [WorkOS](https://workos.com), we have also been working on components specifically geared towards building great authentication experiences. As these rely heavily on forms, we thought it would make sense to provide some fundations in Radix to help with this.

## Detailed design

At the most basic level, the `Form` primitive is a regular Radix primitives package which expose a component split in multiple parts like other primitives. It offers a declarative way to use controls and labels, as well as a validation rules that are built on top of the native browser [constraint validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation).

It abstracts away all of the complexity of accessibility and validation, using standard HTML attributes, as well as aria attributes.

### API example

Let's look at an example:

```jsx
import * as React from 'react';
import * as Form from '@radix-ui/react-form';

function Page() {
  return (
    <Form.Root
      onSubmit={(event) => {
        // `onSubmit` only triggered if it passes client-side validation
        const data = Object.fromEntries(new FormData(event.currentTarget));
        console.log(data);
        event.preventDefault();
      }}
    >
      <Form.Field name="name">
        <Form.Label>Full name</Form.Label>
        <Form.Control />
        <Form.ClientMessage type="missingValue">Please enter your name.</Form.ClientMessage>
      </Form.Field>

      <Form.Field name="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" />
        <Form.ClientMessage type="missingValue">Please enter your email.</Form.ClientMessage>
        <Form.ClientMessage type="typeMismatch">Please provide a valid email.</Form.ClientMessage>
      </Form.Field>

      <Form.Field name="age">
        <Form.Label>Age</Form.Label>
        <Form.Control type="number" min="18" max="57" step="1" />
        <Form.ClientMessage type="missingValue">Please enter your age.</Form.ClientMessage>
        <Form.ClientMessage type="rangeOverflow">You must be 18 or older.</Form.ClientMessage>
        <Form.ClientMessage type="rangeUnderflow">You must be 57 or younger.</Form.ClientMessage>
        <Form.ClientMessage type="stepMismatch">Please enter a whole number.</Form.ClientMessage>
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  );
}
```

Note that there is not state present about the client, everything is uncontrolled by default (yet can be controlled). Also note that there are no attributes necessary to handle accessibility, this is all handled by the primitive:

- label and controls are associated using the `name` provided on `Form.Field`.
- when one or more client-side error message display, they are automatically associated to their matching control and focus is moved to the first invalid control.

### Composition

Using our standard `asChild` approach, you can compose the `Form` primitive parts with your own components.

```jsx
<Form.Field name="name">
  <Form.Label>Full name</Form.Label>
  <Form.Control asChild>
    <TextField variant="primary" />
  </Form.Control>
</Form.Field>
```

### More on validation

#### Providing your own validation messages

When no `children` are provided, `Form.ClientMessage` will render a default error message for the given `type`.

```jsx
<ClientMessage type="missingValue" /> // will yield "This value is missing."
```

You can provide a more meaningful message by providing your own `children`. This also allows for internationalization.

```jsx
<ClientMessage type="missingValue">Please provide a name.</ClientMessage> // will yield "Please provide a name."
```

#### Client-side validation types

`Form.ClientMessage` accepts a required `type` prop (of type `keyof ValidityState`) which is used to determine when the message should show. It matches the native HTML validity state (`ValidityState` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)) which result from using attributes such as `required`, `min`, `max`. The message will show if the given `type` is `true` on the control’s validity state.

This means you can even show something whe the field is valid:

```jsx
<Form.ClientMessage type="valid">✅ Valid!</Form.ClientMessage>
```

#### Custom validation

On top of all the built-in client-side validation types described above you can also provide your own custom validation whislt still making use of the platform's validation abilities. It uses the `customError` type present in the constraint validity API.

You can pass `type="customError"` on `Form.ClientMessage` and provide an `isValid` prop with your custom validation logic.

> `isValid` is called with the current value of the control and the current values of all other controls in the form.

Here's a contrived example:

```jsx
<Form.Field name="name">
  <Form.Label>Full name</Form.Label>
  <Form.Control />
  <Form.ClientMessage type="customError" isValid={(value, fields) => value === 'John'}>
    Only John is allowed.
  </Form.ClientMessage>
</Form.Field>
```

> `isValid` can also be an `async` function (or return a promise) to perform async validation (see type below):

```ts
type CustomValidatorFn = ValidatorSyncFn | ValidatorAsyncFn;
type ValidatorSyncFn = (value: string, fields: FormFields) => boolean;
type ValidatorAsyncFn = (value: string, fields: FormFields) => Promise<boolean>;
type FormFields = { [index in string]?: FormDataEntryValue };
```

#### Accessing the validity state for even more control

Sometimes, you may need to access the raw validity state in order to display your own icons, or interface with your own component library by passing certain props to it. You can do this by using the `Form.ValidityState` part:

```jsx
<Form.Field name="name">
  <Form.Label>Full name</Form.Label>
  <Form.ValidityState>
    {(validity) => (
      <Form.Control asChild>
        <TextField variant="primary" state={getTextFieldState(validity)} />
      </Form.Control>
    )}
  </Form.ValidityState>
</Form.Field>
```

#### Server-side validation

The component also supports server-side validation via `Form.ServerMessage`. It will display accordingly to errors returned by the server. When outside a `Field` part, it will display global errors that aren't tied to a specific field.

Given that the server logic is completely outside of the scope of this component, the errors are provided to it using a controlled API: `serverErrors` and `onServerErrorsChange`.

Similary to `Form.ClientMessage`, all accessibility relating to server errors is handled by the primitive:

- when one or more server-side error message display, they are automatically associated to their matching control and focus is moved to the first invalid control.
- when there are only global server errors, focus is moved to the submit button and the message is associated with it so screen readers announce it.

Let's see the same example as above but with added server-side error handling:

```jsx
import * as React from 'react';
import * as Form from '@radix-ui/react-form';

function Page() {
  const [serverErrors, setServerErrors] = React.useState({});

  return (
    <Form.Root
      onSubmit={(event) => {
        // `onSubmit` only triggered if it passes client-side validation
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));

        // maybe do an async server call and gather some errors from the server to display
        submitForm(data)
        .then(() => …)
        .catch((errors) => setServerErrors(errors));
      }}
      serverErrors={serverErrors}
      onServerErrorsChange={setServerErrors}
    >
      <Form.Field name="name">
        <Form.Label>Full name</Form.Label>
        <Form.Control />
        <Form.ClientMessage type="missingValue">Please enter your name.</Form.ClientMessage>
        <Form.ServerMessage />
      </Form.Field>

      <Form.Field name="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" />
        <Form.ClientMessage type="missingValue">Please enter your email.</Form.ClientMessage>
        <Form.ClientMessage type="typeMismatch">Please provide a valid email.</Form.ClientMessage>
        <Form.ServerMessage />
      </Form.Field>

      <Form.Field name="age">
        <Form.Label>Age</Form.Label>
        <Form.Control type="number" min="18" max="57" step="1" />
        <Form.ClientMessage type="missingValue">Please enter your age.</Form.ClientMessage>
        <Form.ClientMessage type="rangeOverflow">You must be 18 or older.</Form.ClientMessage>
        <Form.ClientMessage type="rangeUnderflow">You must be 57 or younger.</Form.ClientMessage>
        <Form.ClientMessage type="stepMismatch">Please enter a whole number.</Form.ClientMessage>
        <Form.ServerMessage />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>

      <Form.ServerMessage />
    </Form.Root>
  );
}
```

If no `children` are provided to `Form.ServerError`, it will display a concatenation of error messages from the server. If passing a React node, it will render this node instead. For finer control, you can pass a render function instead which will be called with the server errors.

The server messages will be routed to the correct fields, based on the `name` attribute on `Form.Field` matching in the `serverErrors` object (see type below). There is also a `global` key which will be used for global errors (displayed in the `Form.ServerMessage` sitting outside a `Form.Field`).

```ts
interface ServerError {
  code: string;
  message: string;
}

type ServerErrors = {
  [fieldName in string]?: ServerError[];
} & {
  global?: ServerError[];
};
```

## Open questions

- Does this API make sense? Is it easy to use?
- Does this API cover most form use-cases?
- Is the API flexible enough to allow composition with other components?
