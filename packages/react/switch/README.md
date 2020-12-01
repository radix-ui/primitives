# `react-switch`

## Installation

```sh
$ yarn add @interop-ui/react-switch
# or
$ npm install @interop-ui/react-switch
```

## Usage

```js
import * as React from 'react';
import { Switch, SwitchThumb } from '@interop-ui/react-switch';
import { Label } from '@interop-ui/react-label';

function MyComponent(props) {
  return (
    <Label>
      <span>{props.label}</span>
      <Switch onCheckedChange={console.log}>
        <SwitchThumb />
      </Switch>
    </Label>
  );
}
```
