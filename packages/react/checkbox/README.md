# `react-checkbox`

## Installation

```sh
$ yarn add @interop-ui/react-checkbox
# or
$ npm install @interop-ui/react-checkbox
```

## Usage

```js
import * as React from 'react';
import { Checkbox, styles } from '@interop-ui/react-checkbox';
import { Label, styles as labelStyles } from '@interop-ui/react-label';

function MyComponent(props) {
  return (
    <Label style={labelStyles.root}>
      <span>{props.label}</span>
      <Checkbox onCheckedChange={() => props.onCheckedChange()} style={styles.root}>
        <Checkbox.Indicator style={styles.indicator} />
      </Checkbox>
    </Label>
  );
}
```
