# `react-progress-bar`

## Installation

```sh
$ yarn add @interop-ui/react-progress-bar
# or
$ npm install @interop-ui/react-progress-bar
```

## Usage

```js
import * as React from 'react';
import { ProgressBar, styles } from '@interop-ui/react-progress-bar';

function MyComponent(props) {
  const max = props.max || 100;
  const precentage = props.value != null ? Math.round((props.value / max) * 100) : null;
  return (
    <ProgressBar style={{ ...styles.root, ...props.style }} max={max} value={props.value}>
      <ProgressBar.Indicator
        style={{
          ...styles.indicator,
          width: precentage != null ? `${percentage}%` : undefined,
        }}
      />
    </ProgressBar>
  );
}
```
