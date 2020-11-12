# `react-popover`

## Installation

```sh
$ yarn add @interop-ui/react-popover
# or
$ npm install @interop-ui/react-popover
```

## Usage

```js
import * as React from 'react';
import { Popover, styles } from '@interop-ui/react-popover';

function MyComponent(props) {
  return (
    <Popover>
      <Popover.Trigger style={styles.trigger}>Open popover</Popover.Trigger>
      <Popover.Popper style={{ ...styles.popper, ...props.style }} sideOffset={10}>
        <Popover.Content style={styles.content}>
          <p>Some really cool popover content!</p>
          <Popover.Close style={styles.close}>Close popover</Popover.Close>
        </Popover.Content>
        <Popover.Arrow width={50} height={20} style={styles.arrow} />
      </Popover.Popper>
    </Popover>
  );
}
```
