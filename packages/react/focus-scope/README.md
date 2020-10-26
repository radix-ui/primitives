# `react-focus-scope`

## Installation

```sh
$ yarn add @interop-ui/react-focus-scope
# or
$ npm install @interop-ui/react-focus-scope
```

## Usage

```js
import * as React from 'react';
import { FocusScope } from '@interop-ui/react-focus-scope';

function MyComponent(props) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        Open
      </button>

      {open && (
        <FocusScope trapped>
          {({ ref }) => (
            <div ref={ref}>
              <input type="text" />
              <button type="button">Click me</button>
            </div>
          )}
        </FocusScope>
      )}
    </button>
  );
}
```
