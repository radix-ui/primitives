# `react-dismissable-layer`

## Installation

```sh
$ yarn add @interop-ui/react-dismissable-layer
# or
$ npm install @interop-ui/react-dismissable-layer
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
        <DismissableLayer disableOutsidePointerEvents onDismiss={() => setOpen(false)}>
          {(dismissableLayerProps) => (
            <div {...dismissableLayerProps}>
              <p>Some content…</p>
            </div>
          )}
        </DismissableLayer>
      )}
    </>
  );
}
```
