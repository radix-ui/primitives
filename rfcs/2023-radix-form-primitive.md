- Start Date: 2023-02-17
- RFC PR: (leave this empty, to be filled in later)
- Authors: Benoît Grélard
- Updates:
  - 2023-03-03:
    - Reworked message API to remove distinction between client/server validation
      - Now a single `Form.Message` component
      - A single `match` prop now supports all use-cases
    - Reworked server error handling to be less prescriptive (now relying more on messages, rather than the prescriptive `serverErrors` prop)
    - Validation messages / state available outside of `Field` by passing explicit `name` prop

# Radix Form primitive

## Summary

This RFC proposes adding a new primitive to Radix UI primitives: `Form`. It will provide an easier way to create forms in React. The goal is to provide a simple, declarative, uncontrolled (but controllable) API (à la Radix) to create forms that includes client-side validation in an accessible manner, as well as handling of server errors accessibly too.

## Motivation

Forms are a huge part of building for the web, and whilst we do offer building blocks for it (things like `Checkbox`, `Select`, etc) we do not yet have an overarching solution for creating accessible forms. This RFC aims to solve that.

Additionally, similarly to how Radix introduced a great out of the box experience for specific components (not having to wire state or refs for example) we see a big opportunity to do the same for forms as this is a space where we see a lot of people struggle or overcomplicate things.

At [WorkOS](https://workos.com), we have also been working on components specifically geared towards building great authentication experiences (see [Radix Auth RFC](https://github.com/radix-ui/primitives/pull/1978)). As these rely heavily on forms, we thought it would make sense to provide some fundations in Radix to help with this.

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
        <Form.Control /> {/* renders a `input[type="text"]` by default */}
        <Form.Message match="missingValue">Please enter your name.</Form.Message>
      </Form.Field>

      <Form.Field name="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" />
        <Form.Message match="missingValue">Please enter your email.</Form.Message>
        <Form.Message match="typeMismatch">Please provide a valid email.</Form.Message>
      </Form.Field>

      <Form.Field name="age">
        <Form.Label>Age</Form.Label>
        <Form.Control type="number" min="18" max="57" step="1" />
        <Form.Message match="missingValue">Please enter your age.</Form.Message>
        <Form.Message match="rangeOverflow">You must be 18 or older.</Form.Message>
        <Form.Message match="rangeUnderflow">You must be 57 or younger.</Form.Message>
        <Form.Message match="stepMismatch">Please enter a whole number.</Form.Message>
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  );
}
```

Note that there is not state present about the client, everything is uncontrolled by default (yet can be controlled). Also note that there are no attributes necessary to handle accessibility, this is all handled by the primitive:

- label and controls are associated using the `name` provided on `Form.Field`
- when one or more client-side error message display, they are automatically associated to their matching control
- focus is moved to the first invalid control

### Styling

Similar to other Radix primtives, the `Form` primitive is unstyled by default. This means that you can style it using any CSS solution of your choice. Each part is a node you can style. Like other primitives, data attributes are present to aid styling states such as `data-invalid` and `data-valid`.

### Composition

Using Radix's `asChild` approach, you can compose the `Form` primitive parts with your own components.

```jsx
<Form.Field name="name">
  <Form.Label>Full name</Form.Label>
  <Form.Control asChild>
    <TextField variant="primary" />
  </Form.Control>
</Form.Field>
```

It can also be used to compose other types of controls, such as a `select`:

```jsx
<Form.Field name="country">
  <Form.Label>Country</Form.Label>
  <Form.Control asChild>
    <select>
      <option value="uk">United Kingdom</option>…
    </select>
  </Form.Control>
</Form.Field>
```

### More on validation

#### Providing your own validation messages

When no `children` are provided, `Form.Message` will render a default error message for the given `match`.

```jsx
<Form.Message match="missingValue" /> // will yield "This value is missing"
```

You can provide a more meaningful message by providing your own `children`. This also allows for internationalization.

```jsx
<Form.Message match="missingValue">Please provide a name</Form.Message> // will yield "Please provide a name"
```

#### Client-side validation matching

`Form.Message` accepts a `match` prop which is used to determine when the message should show. It matches the native HTML validity state (`ValidityState` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)) which result from using attributes such as `required`, `min`, `max`. The message will show if the given `match` is `true` on the control’s validity state.

```ts
// `match`'s prop accepts a `ValidityMatcher` (see below):

type ValidityMatcher =
  | 'badInput'
  | 'patternMismatch'
  | 'rangeOverflow'
  | 'rangeUnderflow'
  | 'stepMismatch'
  | 'tooLong'
  | 'tooShort'
  | 'typeMismatch'
  | 'valid'
  | 'valueMissing';
```

This means you can even show something whe the field is valid:

```jsx
<Form.Message match="valid">✅ Valid!</Form.Message>
```

#### Custom validation

On top of all the built-in client-side validation matches described above you can also provide your own custom validation whilst still making use of the platform's validation abilities. It uses the `customError` type present in the constraint validity API.

You can pass your own validation function into the `match` prop on `Form.Message`.

```ts
// The `match` prop also accepts a `CustomMatcher` (see below):
type MatchProp = ValidityMatcher | CustomMatcher;
type SyncCustomMatcher = (value: string, formData: FormData) => boolean;
type AsyncCustomMatcher = (value: string, formData: FormData) => Promise<boolean>;
```

> `match` will be called with the current value of the control as first argument and the entire `FormData` as second argument.

Here's a contrived example:

```jsx
<Form.Field name="name">
  <Form.Label>Full name</Form.Label>
  <Form.Control />
  <Form.Message match={(value, formData) => value !== 'John'}>Only John is allowed.</Form.Message>
</Form.Field>
```

> `match` can also be an `async` function (or return a promise) to perform async validation (see type below):

#### Messages outside of a `Form.Field`

When nested inside a `Form.Field` part, `Form.Message` will automatically be wired to the control's validity which exists in the field.
Alternatively you can render a message outside of a `Form.Field` part and pass it a `name` prop explicitly.

#### Accessing the validity state for even more control

Sometimes, you may need to access the raw validity state of a field in order to display your own icons, or interface with your own component library by passing certain props to it. You can do this by using the `Form.ValidityState` part:

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

When nested inside a `Form.Field` part, `Form.ValidityState` will automatically be wired to the control's validity which exists in the field.
Alternatively you can render it outside of a `Form.Field` part and pass it a `name` prop explicitly.

#### Server-side validation

The component also supports server-side validation using the same `Form.Message` component.
You can re-use the same messages you defined for client-side errors by passing a `forceMatch` prop which will for the message to show regardless of the client-side matching logic. If the message doesn't exist on the client-side, you can render a `Form.Message` without a `match` too.
The field is marked as invalid by passing a `serverInvalid` boolean prop to the `Form.Field` part.

The accessibility relating to server errors is handled by the primitive in a similar fashion:

- when one or more server-side error message display, they are automatically associated to their matching control
- focus is moved to the first invalid control

Let's see the same example as above but with added server-side error handling:

```jsx
import * as React from 'react';
import * as Form from '@radix-ui/react-form';

function Page() {
  const [serverErrors, setServerErrors] = React.useState({ name: false, email: false, age: false });

  return (
    <Form.Root
      onSubmit={(event) => {
        // `onSubmit` only triggered if it passes client-side validation
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));

        // maybe do an async server call and gather some errors from the server to display
        submitForm(data)
          .then(() => {})
          /**
           * Map errors from your server response into a structure you'd like to work with.
           * In this case resulting in this object: `{ name: false, email: true, age: true }`
           */
          .catch((errors) => setServerErrors(mapServerErrors(errors)));
      }}
      onClearServerErrors={() => setServerErrors({ name: false, email: false, age: false })}
    >
      <Form.Field name="name" serverInvalid={serverErrors.name}>
        <Form.Label>Full name</Form.Label>
        <Form.Control />
        <Form.Message match="missingValue" forceMatch={serverErrors.name}>
          Please enter your name.
        </Form.Message>
      </Form.Field>

      <Form.Field name="email" serverInvalid={serverErrors.email}>
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" />
        <Form.Message match="missingValue">Please enter your email.</Form.Message>
        <Form.Message match="typeMismatch" forceMatch={serverErrors.email}>
          Please provide a valid email.
        </Form.Message>
      </Form.Field>

      <Form.Field name="age" serverInvalid={serverErrors.age}>
        <Form.Label>Age</Form.Label>
        <Form.Control type="number" min="18" max="57" step="1" />
        <Form.Message match="missingValue">Please enter your age.</Form.Message>
        <Form.Message match="rangeOverflow">You must be 18 or older.</Form.Message>
        <Form.Message match="rangeUnderflow">You must be 57 or younger.</Form.Message>
        <Form.Message match="stepMismatch">Please enter a whole number.</Form.Message>
        {serverErrors.age ? (
          <Form.Message>Registration not open to people aged 40 exactly.</Form.Message>
        ) : null}
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  );
}
```

You should also clear the server errors using the `onClearServerErrors` callback prop on the `Form.Root` part.

> This will clear the server errors before the form is re-submitted, and when the form is reset.

On top of this, it means you have control over when to reset single server errors.
For example you could reset the email server error as soon as the user edits it:

```jsx
<Form.Field name="email" serverInvalid={serverErrors.email}>
  <Form.Label>Email address</Form.Label>
  <Form.Control
    type="email"
    onChange={() => setServerErrors((prev) => ({ ...prev, email: false }))}
  />
  <Form.Message match="missingValue">Please enter your email.</Form.Message>
  <Form.Message match="typeMismatch" forceMatch={serverErrors.email}>
    Please provide a valid email.
  </Form.Message>
</Form.Field>
```

## Open questions

- Does this API make sense?
  - Is it easy to use?
  - Is everything named as you'd expect?
- Does this API cover most form use-cases? Have we missed some use-cases?
- Is the API flexible enough to allow composition with other components?
