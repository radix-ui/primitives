import * as React from 'react';
import { Tabs } from 'radix-ui';

export default function Page() {
  return (
    <Tabs.Root defaultValue="one" orientation="vertical">
      <Tabs.List aria-label="tabs example">
        <Tabs.Trigger value="one">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="two">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="three">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </Tabs.Content>
      <Tabs.Content value="two">You'll never find me!</Tabs.Content>
      <Tabs.Content value="three">
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </Tabs.Content>
    </Tabs.Root>
  );
}
