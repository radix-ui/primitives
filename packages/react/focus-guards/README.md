# `react-focus-guards`

## Installation

```sh
$ yarn add @interop-ui/react-focus-guards
# or
$ npm install @interop-ui/react-focus-guards
```

## Usage

```js
import * as React from 'react';
import { useFocusGuards, FocusGuards } from '@interop-ui/react-focus-guards';

function MyComponent1(props) {
  useFocusGuards();
  return <div onFocus={} onBlur={} />;
}

function MyComponent2(props) {
  return (
    <FocusGuards>
      <div onFocus={} onBlur={} />
    </FocusGuards>
  );
}
```
