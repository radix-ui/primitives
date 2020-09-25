# `react-collapsible`

## Installation

```sh
$ yarn add @interop-ui/react-collapsible
# or
$ npm install @interop-ui/react-collapsible
```

## Usage

```js
import * as React from 'react';
import { Collapsible, styles } from '@interop-ui/react-collapsible';

function MyComponent(props) {
  return (
    <Collapsible style={{ ...styles.root, ...props.style }}>
      <Collapsible.Button style={styles.button}>Button</Collapsible.Button>
      <Collapsible.Content style={styles.content}>Content 1</Collapsible.Content>
    </Collapsible>
  );
}
```
