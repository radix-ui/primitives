# `react-aspect-ratio`

## Installation

```sh
$ yarn add @interop-ui/react-aspect-ratio
# or
$ npm install @interop-ui/react-aspect-ratio
```

## Usage

```js
import * as React from 'react';
import { AspectRatio, styles } from '@interop-ui/react-aspect-ratio';

function MyComponent(props) {
  return (
    <AspectRatio {...props} ratio={2 / 1} style={{ ...styles.root, ...props.style }}>
      <img src="https://picsum.photos/id/10/400/600" alt="" style={{ width: '100%' }} />
    </AspectRatio>
  );
}
```
