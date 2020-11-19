# `react-tooltip`

## Installation

```sh
$ yarn add @interop-ui/react-tooltip
# or
$ npm install @interop-ui/react-tooltip
```

## Usage

```js
import * as React from 'react';
import { Tooltip } from '@interop-ui/react-tooltip';

function MyComponent() {
  return (
    <Tooltip>
      <Tooltip.Trigger>Hover or Focus me</Tooltip.Trigger>
      <Tooltip.Popper sideOffset={5}>
        <Tooltip.Content aria-label="Very useful label">Nicely done!</Tooltip.Content>
        <Tooltip.Arrow offset={10} />
      </Tooltip.Popper>
    </Tooltip>
  );
}
```
