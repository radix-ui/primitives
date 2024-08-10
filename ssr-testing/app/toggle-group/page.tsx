import * as React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

export default function Page() {
  return (
    <ToggleGroup.Root defaultValue="1" type="single">
      <ToggleGroup.Item value="1">Item 1</ToggleGroup.Item>
      <ToggleGroup.Item value="2">Item 2</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
