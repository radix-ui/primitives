# `react-announce`

## Installation

```sh
$ yarn add @interop-ui/react-announce
# or
$ npm install @interop-ui/react-announce
```

## Usage

```js
import * as React from 'react';
import { Announce, styles } from '@interop-ui/react-announce';
import { VisuallyHidden, styles as visuallyHiddenStyles } from '@interop-ui/react-visually-hidden';

function StatusChange(props) {
  return (
    <div>
      <VisuallyHidden style={visuallyHiddenStyles.root}>
        {/* Content inside Announce will inform screen reader users of a status change */}
        <Announce aria-relevant="all">Your friend is {props.status}</Announce>
      </VisuallyHidden>
      {/*
      You can render the content visually however you'd like. Announce content is added to an
      aria-live region. They'll be rendered visually by default, but since we've visually hidden
      the content above we can mirror it for sighted users and adapt our interface as needed, so
      long as the same content is effectively delivered to users in either context.
      */}
      <div style={{ background: props.status === 'online' ? 'forestgreen' : 'crimson' }}>
        Friend status: {props.status}
      </div>
    </div>
  );
}
```
