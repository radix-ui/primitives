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
import { AspectRatio } from '@interop-ui/react-aspect-ratio';

function MyComponent() {
  return (
    <AspectRatio ratio={2 / 1}>
      <img
        src="https://picsum.photos/id/10/400/600"
        alt=""
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </AspectRatio>
  );
}
```
