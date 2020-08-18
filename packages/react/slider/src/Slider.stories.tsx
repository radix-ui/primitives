import * as React from 'react';
import { Slider, styles } from './Slider';

export default { title: 'Slider' };

export const Basic = () => (
  <Slider.Root style={styles.root}>
    <Slider.Track style={styles.track}>
      <Slider.Range style={styles.range} />
    </Slider.Track>
    <Slider.Thumb style={styles.thumb} />
  </Slider.Root>
);

export const InlineStyle = () => (
  <Slider.Root style={styles.root}>
    <Slider.Track
      style={{
        ...styles.track,
        height: 4,
        background: 'gainsboro',
        borderRadius: 4,
      }}
    >
      <Slider.Range
        style={{
          ...styles.range,
          background: 'black',
        }}
      />
    </Slider.Track>
    <Slider.Thumb
      style={{
        ...styles.thumb,
        borderRadius: 15,
        width: 15,
        height: 15,
        background: 'black',
      }}
    />
  </Slider.Root>
);
