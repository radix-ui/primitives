import * as React from 'react';
import { Slider, styles as sliderStyles } from './Slider';

export default { title: 'Slider' };

export const Basic = () => (
  <Slider.Root style={styles.root}>
    <Slider.Track style={styles.track}>
      <Slider.Range style={styles.range} />
    </Slider.Track>
    <Slider.Thumb style={styles.thumb} />
  </Slider.Root>
);

const styles = {
  root: sliderStyles.root,
  track: {
    ...sliderStyles.track,
    height: 4,
    background: 'gainsboro',
    borderRadius: 4,
  },
  range: {
    ...sliderStyles.range,
    background: 'black',
  },
  thumb: {
    ...sliderStyles.thumb,
    borderRadius: 15,
    width: 15,
    height: 15,
    background: 'black',
  },
};
