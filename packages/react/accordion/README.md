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
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} from '@interop-ui/react-accordion';

function MyComponent() {
  return (
    <Accordion>
      {/* start items */}

      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionButton>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>Content for item 1</AccordionPanel>
      </AccordionItem>

      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionButton>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>Content for item 2</AccordionPanel>
      </AccordionItem>

      {/* end items */}
    </Accordion>
  );
}
```
