# `react-polymorphic`

## Installation

```sh
$ yarn add @interop-ui/react-polymorphic
# or
$ npm install @interop-ui/react-polymorphic
```

## Usage

```js
import * as React from 'react';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';

const MyComponent = forwardRefWithAs<HTMLDivElement, React.ComponentProps<'div'>>(
  (props, forwardedRef) => {
    const { as: Comp = 'div' } = props;
    return <Comp {...props} ref={forwardedRef}>
  }
)
```
