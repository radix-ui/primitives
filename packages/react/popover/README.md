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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
} from '@interop-ui/react-popover';

function MyComponent(props) {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      <PopoverContent sideOffset={10}>
        <PopoverContent>
          <p>Some really cool popover content!</p>
          <PopoverClose>Close popover</PopoverClose>
        </PopoverContent>
        <PopoverArrow width={50} height={20} />
      </PopoverContent>
    </Popover>
  );
}
```
