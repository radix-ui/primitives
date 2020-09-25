# `react-portal`

## Installation

```sh
$ yarn add @interop-ui/react-portal
# or
$ npm install @interop-ui/react-portal
```

## Usage

```js
import * as React from 'react';
import { Portal } from '@interop-ui/react-portal';

function MyComponent(props) {
  return (
    <div>
      <h1>This content is rendered in the main DOM tree</h1>
      <Portal>
        <h1>This content is rendered in a portal (another DOM tree)</h1>
        <p>
          Because of the portal, it can appear in a different DOM tree from the content above (by
          default, a new element inside the body), even though it is part of the same React tree.
        </p>
      </Portal>
    </div>
  );
}
```
