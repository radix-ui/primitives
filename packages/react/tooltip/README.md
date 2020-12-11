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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipContent,
  TooltipArrow,
} from '@interop-ui/react-tooltip';

function MyComponent() {
  return (
    <Tooltip>
      <TooltipTrigger>Hover or Focus me</TooltipTrigger>
      <TooltipContent sideOffset={5}>
        <TooltipContent aria-label="Very useful label">Nicely done!</TooltipContent>
        <TooltipArrow offset={10} />
      </TooltipContent>
    </Tooltip>
  );
}
```
