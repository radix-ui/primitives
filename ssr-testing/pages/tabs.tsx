import * as React from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '@radix-ui/react-tabs';

export default function TabsPage() {
  return (
    <Tabs defaultValue="one" orientation="vertical">
      <TabsList aria-label="tabs example">
        <TabsTab value="one">Tab 1</TabsTab>
        <TabsTab value="two">Tab 2</TabsTab>
        <TabsTab value="three">Tab 3</TabsTab>
      </TabsList>
      <TabsPanel value="one">
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsPanel>
      <TabsPanel value="two">You'll never find me!</TabsPanel>
      <TabsPanel value="three">
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsPanel>
    </Tabs>
  );
}
