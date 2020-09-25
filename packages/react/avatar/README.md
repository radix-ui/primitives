# `react-avatar`

## Installation

```sh
$ yarn add @interop-ui/react-avatar
# or
$ npm install @interop-ui/react-avatar
```

## Usage

```js
import * as React from 'react';
import { Avatar, styles } from '@interop-ui/react-avatar';

function MyComponent(props) {
  return (
    <Avatar {...props} style={{ ...styles.root, ...props.style }}>
      <Avatar.Image
        alt={props.userDisplayName}
        src={props.userAvatar}
        style={styles.image}
        onLoadingStatusChange={() => props.loadingCallback()}
      />
      <Avatar.Fallback>{props.userInitials}</Avatar.Fallback>
    </Avatar>
  );
}
```
