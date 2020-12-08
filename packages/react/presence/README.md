# `react-presence`

## Installation

```sh
$ yarn add @interop-ui/react-presence
# or
$ npm install @interop-ui/react-presence
```

## Usage

Manages mounting/unmounting of its child component. It will suspend the unmount phase if the child component is animating or transitioning via CSS.

```js
import * as React from 'react';
import { Presence } from '@interop-ui/react-presence';

function MyComponent(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Presence present={isOpen}>
      <div {...props}>Content</div>
    </Presence>
  );
}
```
