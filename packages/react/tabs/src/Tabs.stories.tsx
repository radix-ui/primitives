import * as React from 'react';
import { Tabs } from './Tabs';

export default { title: 'Tabs' };

export const Basic = () => (
  <Tabs defaultSelectedId="tab1">
    <Tabs.List aria-label="tabs example">
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2" disabled>
        Tab 2
      </Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id="tab1">Panel 1</Tabs.Panel>
    <Tabs.Panel id="tab2">Panel 2</Tabs.Panel>
    <Tabs.Panel id="tab3">Panel 3</Tabs.Panel>
  </Tabs>
);
