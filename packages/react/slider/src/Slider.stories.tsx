import * as React from 'react';
import { Slider as SliderPrimitive, styles } from './Slider';

export default { title: 'Slider' };

export const Basic = () => (
  <Slider>
    <SliderTrack>
      <SliderRange />
    </SliderTrack>
    <SliderThumb />
  </Slider>
);

export const InlineStyle = () => (
  <Slider>
    <SliderTrack
      style={{
        height: 4,
        background: 'gainsboro',
        borderRadius: 4,
      }}
    >
      <SliderRange style={{ background: 'black' }} />
    </SliderTrack>
    <SliderThumb
      style={{
        borderRadius: 15,
        width: 15,
        height: 15,
        background: 'black',
      }}
    />
  </Slider>
);

const Slider = (props: React.ComponentProps<typeof SliderPrimitive>) => (
  <SliderPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const SliderRange = (props: React.ComponentProps<typeof SliderPrimitive.Range>) => (
  <SliderPrimitive.Range {...props} style={{ ...styles.range, ...props.style }} />
);

const SliderTrack = (props: React.ComponentProps<typeof SliderPrimitive.Track>) => (
  <SliderPrimitive.Track {...props} style={{ ...styles.track, ...props.style }} />
);

const SliderThumb = (props: React.ComponentProps<typeof SliderPrimitive.Thumb>) => (
  <SliderPrimitive.Thumb {...props} style={{ ...styles.thumb, ...props.style }} />
);
