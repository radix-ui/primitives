import * as React from 'react';
import * as Menubar from '.';

export default { title: 'Components/Menubar' };

export const Default = () => (
  <Menubar.Root>
    <Menubar.Menu>
      <Menubar.Trigger>Menu 1</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item>Item 1</Menubar.Item>
        <Menubar.Menu>
          <Menubar.TriggerItem>Menu Nested</Menubar.TriggerItem>
          <Menubar.Content>
            <Menubar.Item>Item Nested</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Item>Item 2</Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger>Menu 2</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item>Item 1</Menubar.Item>
        <Menubar.Menu>
          <Menubar.TriggerItem>Menu Nested</Menubar.TriggerItem>
          <Menubar.Content>
            <Menubar.Item>Item Nested</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Item>Item 2</Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
  </Menubar.Root>
);
