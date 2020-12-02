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
import { Avatar, AvatarImage, AvatarFallback } from '@interop-ui/react-avatar';

function MyComponent(props) {
  return (
    <Avatar>
      <AvatarImage
        alt={props.userDisplayName}
        src={props.userAvatar}
        onLoadingStatusChange={() => props.loadingCallback()}
      />
      <AvatarFallback>{props.userInitials}</AvatarFallback>
    </Avatar>
  );
}
```
