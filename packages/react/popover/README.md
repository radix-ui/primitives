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
import { Popover } from '@interop-ui/react-popover';

function MyComponent(props) {
  return (
    <Popover>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Popper sideOffset={10}>
        <Popover.Content>
          <p>Some really cool popover content!</p>
          <Popover.Close>Close popover</Popover.Close>
        </Popover.Content>
        <Popover.Arrow width={50} height={20} />
      </Popover.Popper>
    </Popover>
  );
}
```
