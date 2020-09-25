# `react-arrow`

## Installation

```sh
$ yarn add @interop-ui/react-arrow
# or
$ npm install @interop-ui/react-arrow
```

## Usage

```js
import * as React from 'react';
import { Arrow, styles } from '@interop-ui/react-arrow';

function MyComponent(props) {
  return (
    <Arrow
      {...props}
      width={20}
      height={10}
      style={{
        ...styles.root,
        ...props.style,
        fill: 'royalblue',
      }}
    />
  );
}
```
