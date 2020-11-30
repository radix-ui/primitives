# `react-radio-group`

## Installation

```sh
$ yarn add @interop-ui/react-radio-group
# or
$ npm install @interop-ui/react-radio-group
```

## Usage

```js
import * as React from 'react';
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from '@interop-ui/react-radio-group';
import { Label } from '@interop-ui/react-label';

function MyComponent(props) {
  return (
    <Label>
      <span>{props.label}</span>
      <RadioGroup defaultValue="1">
        <Label>
          <RadioGroupItem as={StyledItem} value="1">
            <RadioGroupIndicator as={StyledIndicator} />
          </RadioGroupItem>
          Cat
        </Label>{' '}
        <Label>
          <RadioGroupItem as={StyledItem} value="2">
            <RadioGroupIndicator as={StyledIndicator} />
          </RadioGroupItem>
          Dog
        </Label>{' '}
        <Label>
          <RadioGroupItem as={StyledItem} value="3">
            <RadioGroupIndicator as={StyledIndicator} />
          </RadioGroupItem>
          Rabbit
        </Label>
      </RadioGroup>
    </Label>
  );
}
```
