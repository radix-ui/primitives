# `react-tabs`

## Installation

```sh
$ yarn add @interop-ui/react-tabs
# or
$ npm install @interop-ui/react-tabs
```

## Usage

```js
import * as React from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '@interop-ui/react-tabs';

function MyComponent(props) {
  return (
    <Tabs defaultSelectedId="tab1">
      <TabsList aria-label="tabs example">
        <TabsTab id="tab1">Tab 1</TabsTab>
        <TabsTab id="tab2" disabled>
          Tab 2
        </TabsTab>
        <TabsTab id="tab3">Tab 3</TabsTab>
      </TabsList>
      <TabsPanel id="tab1">Panel 1</TabsPanel>
      <TabsPanel id="tab2">Panel 2</TabsPanel>
      <TabsPanel id="tab3">Panel 3</TabsPanel>
    </Tabs>
  );
}
```
