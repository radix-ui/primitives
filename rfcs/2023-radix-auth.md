- Start Date: 2023-02-21
- RFC PR: (leave this empty, to be filled in later)
- Authors: Benoît Grélard

# Radix Auth

## Summary

This RFC proposes adding a new project under the Radix UI umbrella (at the same level as "Radix Primitives", "Radix Colors", "Radix Icons"). This new product would be called "Radix Auth" and would provide a set of components specifically tailored to building great authentication experiences.

It would build on top of the new `Form` primitive discussed in the [Radix Form primitive RFC](2023-radix-form-primitive.md) but provide higher level components geared towards specific scenarios such as sign-up, sign-in, password reset flows, etc.

## Motivation

At [WorkOS](https://workos.com), we build enterprise-ready features such as Single Sign-On, Directory-Sync and Audit Logs. A lot of these features revolve around great authentication experiences.

We also build and maintain [Radix UI](https://radix-ui.com). We believe we could bring a similar level of quality to authentication experiences as people are used to with Radix primitives. Think everything you love about Radix: similar multi-parts API, great accessibility, great developer experience, etc.

## Design

At the most basic level, this would include new primitives such as `SignUp`, `SignIn` which would use the new [`Form` primitive](2023-radix-form-primitive.md) and provide an out of the box experience catered specifically for authentication flows. On top of that we would also provide other composable primitives such as `OTPInput`, `Password`, other primitives to visually represent password strength and more.

### Examples

#### A full sign-up UI composing a set of primitives

https://user-images.githubusercontent.com/1539897/220597308-1fdc68a3-aaf5-46b2-a59d-4b5a1bc9ecaa.mp4

---

#### A password input with built-in show/hide functionality

https://user-images.githubusercontent.com/1539897/220597112-cb3b74cc-e38b-4fdb-a0dc-83ca5de9c27a.mp4

---

#### An input for multi-factor authentication (one time password)

https://user-images.githubusercontent.com/1539897/220597235-316c0251-0173-4c37-a522-f0b19cec447d.mp4

---

#### Other primitives to visually represent password strength

https://user-images.githubusercontent.com/1539897/220597276-8896cf0f-7e8b-4d91-8c23-2a6a2ea866af.mp4

Over time, we would keep providing value by incorporating learnings from our own products around single sign-on, multi-factor authentication, etc.

### API example

Here is a work in progress example of what the `SignUp` API might look like:

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

For more information about the accessibility you get out of the box and how validation works, see the [Radix Form primitive RFC](2023-radix-form-primitive.md).

### Styling

Similar to Radix primitives, these higher-level components are unstyled by default. This means that you can style them using any CSS solution of your choice. Each part is a node you can style.

### Composition

Using Radix's `asChild` approach, you can compose the `Form` primitive parts with your own components.

```jsx
<SignUp.EmailField>
  <SignUp.Label>Email</SignUp.Label>
  <SignUp.EmailInput asChild>
    <TextField variant="primary" />
  </SignUp.EmailInput>
</SignUp.EmailField>
```

It can neatly compose with other primitives we would provide, for example a `Password` primitive.

```diff
<SignUp.PasswordField>
  <SignUp.Label>Password</SignUp.Label>
-  <SignUp.PasswordInput />
+  <Password.Root>
+    <SignUp.PasswordInput asChild>
+      <Password.Input />
+    </SignUp.PasswordInput>
+    <Password.ShowHide>
+      <Password.VisibleIcon>
+        <EyeOpenIcon />
+      </Password.VisibleIcon>
+      <Password.HiddenIcon>
+        <EyeNoneIcon />
+      </Password.HiddenIcon>
+    </Password.ShowHide>
+  </Password.Root>
</SignUp.PasswordField>
```

## Open questions

- What problems would this solve for you?
- What would you like to see in this project?
  - What use cases should it cover?
- Any other feedback?
