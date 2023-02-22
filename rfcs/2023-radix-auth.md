- Start Date: 2023-02-21
- RFC PR: (leave this empty, to be filled in later)
- Authors: Benoît Grélard

# Radix Auth

## Summary

This RFC proposes adding a new product under the Radix UI umbrella (at the same level as "Radix Primitives", "Radix Colors", "Radix Icons"). This new product would be called "Radix Auth" and would provide a set of components specifically tailored to building great authentication experiences.

It would build on top of the new `Form` primitive discussed in the [Radix Form primitive RFC](2023-radix-form-primitive.md) but provide higher level components geared towards specific scenarios such as sign-up, sign-in, password reset flows, etc.

Here are some video examples of what this might enable:

## Motivation

At [WorkOS](https://workos.com), we build enterprise-ready features such as Single Sign-On, Directory-Sync and Audit Logs. A lot of these features revolve around great authentication experiences.

We also build and maintain [Radix UI](https://radix-ui.com). We believe we could bring a similar level of quality to authentication experiences as people are used to with Radix primitives. Think everything you love about Radix: similar multi-parts API, great accessibility, great developer experience, etc.

## Design

At the most basic level, we would have different baked-in delineation of new primitives such as `SignUp`, `SignIn`, which would build on top of the [`Form` primitive](2023-radix-form-primitive.md) but provide more specific good defaults out of the box. On top of that we would also provide other composable primitives such as `OTPInput`, `Password`, as well as other graphical primitives to represent password complexity for example, etc.

Over time, we would keep providing value by incorporating learnings from our own products around single sign-on, multi-factor authentication, etc.

### API example

Here is an example of what the API could look like (not definitive):

```jsx
import * as React from 'react';
import * as SignUp from '@radix-ui/auth/sign-up'; // for example

function Page() {
  return (
    <SignUp.Root
      onSubmit={(event) => {
        // `onSubmit` only triggered if it passes client-side validation
        const data = Object.fromEntries(new FormData(event.currentTarget));
        console.log(data);
        event.preventDefault();
      }}
    >
      <SignUp.EmailField>
        <SignUp.Label>Email address</SignUp.Label>
        <SignUp.EmailInput />
        <SignUp.ClientMessage type="missingValue">Please enter your email.</SignUp.ClientMessage>
        <SignUp.ClientMessage type="typeMismatch">
          Please provide a valid email.
        </SignUp.ClientMessage>
      </SignUp.EmailField>

      <SignUp.PasswordField>
        <SignUp.Label>Password</SignUp.Label>
        <SignUp.PasswordInput />
        <SignUp.ClientMessage type="missingValue">Please enter a password.</SignUp.ClientMessage>
        <SignUp.ClientMessage type="tooShort">Password is too short.</SignUp.ClientMessage>
      </SignUp.PasswordField>

      <SignUp.Submit>Sign-up</SignUp.Submit>
    </SignUp.Root>
  );
}
```

For more information about what accessibility you get out of the box and how validation works, see the [Radix Form primitive RFC](2023-radix-form-primitive.md).

### Styling

Similar to Radix primitives, these higher-level components are unstyled by default. This means that you can style it using any CSS solution of your choice. Each part is a node you can style.

### Composition

Using our standard `asChild` approach, you can compose the `Form` primitive parts with your own components.

```jsx
<SignUp.EmailField>
  <SignUp.Label>Email</SignUp.Label>
  <SignUp.EmailInput asChild>
    <TextField variant="primary" />
  </SignUp.EmailInput>
</SignUp.EmailField>
```

It can also be used to compose neatly with other primitives we would provide, such as a `Password` primitive which would handle showing/hiding the password temporarily (accessibbly and securely):

From:

```jsx
<SignUp.PasswordField>
  <SignUp.Label>Password</SignUp.Label>
  <SignUp.PasswordInput />
</SignUp.PasswordField>
```

To:

```jsx
<SignUp.PasswordField>
  <SignUp.Label>Password</SignUp.Label>
  <Password.Root>
    <SignUp.PasswordInput asChild>
      <Password.Input />
    </SignUp.PasswordInput>
    <Password.ShowHide>
      <Password.VisibleIcon>
        <EyeOpenIcon />
      </Password.VisibleIcon>
      <Password.HiddenIcon>
        <EyeNoneIcon />
      </Password.HiddenIcon>
    </Password.ShowHide>
  </Password.Root>
</SignUp.PasswordField>
```

## Open questions

- Would you use something like this?
- What would you like to see in this product?
- Any other feedback?
