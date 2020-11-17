# `react-accessible-icon`

## Installation

```sh
$ yarn add @interop-ui/react-accessible-icon
# or
$ npm install @interop-ui/react-accessible-icon
```

## Usage

```js
import * as React from 'react';
import { AccessibleIcon } from '@interop-ui/react-accessible-icon';

function MyComponent() {
  return (
    <AccessibleIcon label="Very useful label describing the icon for assistive tech users!">
      <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
        <path d="M2 30 L30 2 M30 30 L2 2" />
      </svg>
    </AccessibleIcon>
  );
}
```
