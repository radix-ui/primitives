# `react-switch`

View docs [here](https://radix-ui.com/primitives/docs/components/switch).

## React 19 actions

Use `checkedChangedAction` when a checked-state change starts async work. Switch displays the requested checked state optimistically with React 19.2+ optimistic update semantics, invokes the action in a transition, and ignores additional toggles while the action it started is pending.

```tsx
<Switch.Root
  checked={notificationsEnabled}
  checkedChangedAction={async (nextChecked) => {
    await updateNotificationPreference(nextChecked);
    setNotificationsEnabled(nextChecked);
  }}
>
  <Switch.Thumb />
</Switch.Root>
```

The existing `onCheckedChange` callback remains available for synchronous observation and local updates. When `checkedChangedAction` is used, `Switch.Root` and `Switch.Thumb` expose `data-pending` and `data-optimistic` for custom styling. The prop requires React 19.2 or newer.
