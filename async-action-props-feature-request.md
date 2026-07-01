## Feature request

### Overview

Radix Select and Switch should expose action-style props for user-driven value changes:

```tsx
<Select.Root
  value={plan}
  valueChangedAction={async (nextPlan) => {
    await updateSubscriptionPlan(nextPlan);
  }}
>
  {/* ... */}
</Select.Root>
```

```tsx
<Switch.Root
  checked={notificationsEnabled}
  checkedChangedAction={async (nextChecked) => {
    await updateNotificationPreference(nextChecked);
  }}
>
  <Switch.Thumb />
</Switch.Root>
```

The existing synchronous callbacks, such as `onValueChange` and `onCheckedChange`, should continue to work for local state updates, analytics, and other synchronous observation. The action props are for changes that start async work, such as persistence, server mutations, async validation, or settings updates.

When an action prop is used, the primitive should optimistically display the requested value immediately using React's optimistic update semantics, invoke the action in a transition, and guard against duplicate/conflicting interactions while that action is pending. Styling remains user-owned through data attributes such as `data-pending` and `data-optimistic`; Radix should not prescribe loading visuals.

Because this behavior depends on modern React action and optimistic update APIs, action props should fail fast when used outside React 19.2 or newer.

### Examples in other libraries

- Astryx, Meta's design system, exposes action-style component APIs: https://astryx.atmeta.com/
- React Actions: https://react.dev/blog/2024/12/05/react-19#actions
- React `useOptimistic`: https://react.dev/reference/react/useOptimistic
- React `useTransition`: https://react.dev/reference/react/useTransition

### Who does this impact? Who is this for?

This is for product teams building settings screens, dashboards, forms, and account-management flows where changing a Select or Switch often starts async work.

Without action props, users repeatedly bridge async work into primitives manually:

```tsx
const [isSaving, setIsSaving] = React.useState(false);

async function handleCheckedChange(nextChecked: boolean) {
  setIsSaving(true);
  await savePreference(nextChecked);
  setChecked(nextChecked);
  setIsSaving(false);
}

<Switch.Root
  checked={checked}
  disabled={isSaving}
  onCheckedChange={handleCheckedChange}
/>
```

That works, but every app has to reimplement pending state, duplicate-interaction guards, optimistic feedback, and reconciliation. Moving the interaction boundary into the primitive gives users a consistent async path while preserving existing synchronous callbacks.

### Additional context

This keeps Radix headless:

- Radix owns action invocation, transition wrapping, optimistic value display, duplicate-interaction guarding, accessibility semantics, and state data attributes.
- Users own loading visuals, pending text, spinners, toasts, disabled styling, and broader application UI.
- Errors from rejected actions should surface to React or framework-level error handling rather than being swallowed by the primitive.

The initial scope can stay focused on value-changing primitives where delayed visual feedback feels broken, starting with Select and Switch.
