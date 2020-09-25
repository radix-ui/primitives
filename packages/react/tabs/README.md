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
import { Tabs, styles } from '@interop-ui/react-tabs';

function MyComponent(props) {
  return (
    <Tabs defaultSelectedId="tab1">
      <Tabs.List aria-label="tabs example" style={styles.tabList}>
        <Tabs.Tab id="tab1" style={styles.tab}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab id="tab2" style={styles.tab} disabled>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab id="tab3" style={styles.tab}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="tab1" style={styles.panel}>
        Panel 1
      </Tabs.Panel>
      <Tabs.Panel id="tab2" style={styles.panel}>
        Panel 2
      </Tabs.Panel>
      <Tabs.Panel id="tab3" style={styles.panel}>
        Panel 3
      </Tabs.Panel>
    </Tabs>
  );
}
```
