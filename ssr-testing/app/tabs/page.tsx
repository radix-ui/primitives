import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

export default function Page() {
  return (
    <Tabs defaultValue="one" orientation="vertical">
      <TabsList aria-label="tabs example">
        <TabsTrigger value="one">Tab 1</TabsTrigger>
        <TabsTrigger value="two">Tab 2</TabsTrigger>
        <TabsTrigger value="three">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        Dis metus rhoncus sit convallis sollicitudin vel cum, hac purus tincidunt eros sem himenaeos
        integer, faucibus varius nullam nostra bibendum consectetur mollis, gravida elementum
        pellentesque volutpat dictum ipsum.
      </TabsContent>
      <TabsContent value="two">You'll never find me!</TabsContent>
      <TabsContent value="three">
        Ut nisi elementum metus semper mauris dui fames accumsan aenean, maecenas ac sociis dolor
        quam tempus pretium.
      </TabsContent>
    </Tabs>
  );
}
