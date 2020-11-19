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
import { Checkbox } from '@interop-ui/react-checkbox';
import { Label } from '@interop-ui/react-label';

function MyComponent(props) {
  return (
    <Label>
      <span>{props.label}</span>
      <Checkbox onCheckedChange={() => props.onCheckedChange()}>
        <Checkbox.Indicator />
      </Checkbox>
    </Label>
  );
}
```
