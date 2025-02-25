import * as React from 'react';
import * as Select from '@radix-ui/react-select';

export default function Page() {
  return (
    <>
      <Select.Root defaultValue="1">
        <Select.Trigger>
          <Select.Value />
          <Select.Icon>▼</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton>▲</Select.ScrollUpButton>
            <Select.Viewport>
              <Select.Item value="1">
                <Select.ItemText>Item 1</Select.ItemText>
                <Select.ItemIndicator>✔</Select.ItemIndicator>
              </Select.Item>
              <Select.Item value="2">
                <Select.ItemText>Item 2</Select.ItemText>
                <Select.ItemIndicator>✔</Select.ItemIndicator>
              </Select.Item>
              <Select.Item value="3">
                <Select.ItemText>Item 3</Select.ItemText>
                <Select.ItemIndicator>✔</Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton>▼</Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <form>
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick an option" />
            <Select.Icon>▼</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.ScrollUpButton>▲</Select.ScrollUpButton>
              <Select.Viewport>
                <Select.Item value="1">
                  <Select.ItemText>Item 1</Select.ItemText>
                  <Select.ItemIndicator>✔</Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="2">
                  <Select.ItemText>Item 2</Select.ItemText>
                  <Select.ItemIndicator>✔</Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="3">
                  <Select.ItemText>Item 3</Select.ItemText>
                  <Select.ItemIndicator>✔</Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              <Select.ScrollDownButton>▼</Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </form>
    </>
  );
}
