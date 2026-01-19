import * as React from 'react';
import { NavigationMenu } from 'radix-ui';

export default function Page() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Nav Menu Item 1</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/">Nav Menu Item 2</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
