# `react-accordion`

## Installation

```sh
$ yarn add @interop-ui/react-accordion
# or
$ npm install @interop-ui/react-accordion
```

## Usage

```js
import * as React from 'react';
import { Accordion } from '@interop-ui/react-accordion';

function MyComponent() {
  return (
    <Accordion>
      {/* start items */}

      <Accordion.Item value="one">
        <Accordion.Header>
          <Accordion.Button>One</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel>Content for item 1</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="two">
        <Accordion.Header>
          <Accordion.Button>Two</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel>Content for item 2</Accordion.Panel>
      </Accordion.Item>

      {/* end items */}
    </Accordion>
  );
}
```
