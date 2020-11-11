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
import { Tooltip, styles } from '@interop-ui/react-tooltip';

function MyComponent(props) {
  return (
    <Tooltip>
      <Tooltip.Trigger style={styles.trigger}>Hover or Focus me</Tooltip.Trigger>
      <Tooltip.Popper style={styles.popper} sideOffset={5}>
        <Tooltip.Content style={styles.content} aria-label="Very useful label">
          Nicely done!
        </Tooltip.Content>
        <Tooltip.Arrow style={styles.arrow} offset={10} />
      </Tooltip.Popper>
    </Tooltip>
  );
}
```
