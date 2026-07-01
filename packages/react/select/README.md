# `react-select`

View docs [here](https://radix-ui.com/primitives/docs/components/select).

## React 19 actions

Use `valueChangedAction` when a value change starts async work. Select displays the requested value optimistically with React 19.2+ optimistic update semantics, invokes the action in a transition, and ignores additional selections while the action it started is pending.

```tsx
<Select.Root
  value={plan}
  valueChangedAction={async (nextPlan) => {
    await updateSubscriptionPlan(nextPlan);
    setPlan(nextPlan);
  }}
>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="starter">
      <Select.ItemText>Starter</Select.ItemText>
    </Select.Item>
    <Select.Item value="pro">
      <Select.ItemText>Pro</Select.ItemText>
    </Select.Item>
  </Select.Content>
</Select.Root>
```

The existing `onValueChange` callback remains available for synchronous observation and local updates. When `valueChangedAction` is used, `Select.Trigger` and `Select.Item` expose `data-pending` and `data-optimistic` for custom styling. The prop requires React 19.2 or newer.
