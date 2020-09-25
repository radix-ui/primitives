# `react-accordion`

## Installation

```sh
$ yarn add @interop-ui/react-accordion
# or
$ npm install @interop-ui/react-accordion
```

## Usage

```js
import * as React from 'react';
import { Accordion, styles } from '@interop-ui/react-accordion';

function MyComponent(domProps) {
  return (
    <Accordion {...domProps} style={{ ...styles.root, ...domProps.style }}>
      {/* start items */}

      <Accordion.Item style={styles.item} value="one">
        <Accordion.Header style={styles.header}>
          <Accordion.Button style={styles.button}>One</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel>Content for item 1</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item style={styles.item} value="two">
        <Accordion.Header style={styles.header}>
          <Accordion.Button style={styles.button}>Two</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel>Content for item 2</Accordion.Panel>
      </Accordion.Item>

      {/* end items */}
    </Accordion>
  );
}
```
