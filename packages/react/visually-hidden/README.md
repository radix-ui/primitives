# `react-visually-hidden`

## Installation

```sh
$ yarn add @interop-ui/react-visually-hidden
# or
$ npm install @interop-ui/react-visually-hidden
```

## Usage

```js
import * as React from 'react';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';

function MyComponent(props) {
  return (
    <VisuallyHidden>
      Screen reader users will hear this message, but it will be visually hidden on the screen.
    </VisuallyHidden>
  );
}
```
