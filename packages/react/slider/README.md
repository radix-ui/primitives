# `react-slider`

## Installation

```sh
$ yarn add @interop-ui/react-slider
# or
$ npm install @interop-ui/react-slider
```

## Usage

```js
import * as React from 'react';
import { Slider, SliderTrack, SliderRange, SliderThumb } from '@interop-ui/react-slider';

function SingleThumbSlider() {
  return (
    <Slider defaultValue={10} step={1} min={1} max={10}>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}

function MultipleThumbSlider() {
  return (
    <Slider defaultValue={[10, 20]} step={1} min={1} max={10} minStepsBetweenThumbs={1}>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
      <SliderThumb />
    </Slider>
  );
}
```

| Prop                    | Type                                      | Description                                                                                                                         |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `defaultValue`          | `number \| number[]`                      | Value for an uncontrolled slider. When passed as an array it will become a range slider.                                            |
| `value`                 | `number \| number[]`                      | Value for a controlled slider. When passed as an array it will become a range slider.                                               |
| `dir`                   | `"ltr" \| "rtl" \| undefined`             | Indicates the directionality of the slider (default: `"ltr"`).                                                                      |
| `disabled`              | `boolean \| undefined`                    | Prevents the user from interacting with the slider (default: `false`).                                                              |
| `min`                   | `number \| undefined`                     | The minimum permitted value (default: `0`).                                                                                         |
| `minStepsBetweenThumbs` | `number \| undefined`                     | Indicates the minimum number of steps that should be maintained between two or more thumbs when using a range slider (default `0`). |
| `max`                   | `number \| undefined`                     | The maximum permitted value (default: `100`).                                                                                       |
| `step`                  | `number \| undefined`                     | The stepping interval.                                                                                                              |
| `name`                  | `string \| undefined`                     | Name of the slider. For example used to identify the fields in form submits.                                                        |
| `orientation`           | `"horizontal" \| "vertical" \| undefined` | Indicates horizontal or vertical orientation. (default: `"horizontal"`).                                                            |
| `onChange`              | `(value: number \| number[]) => void`     | Callback that fires when the value changes.                                                                                         |
