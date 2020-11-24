import * as React from 'react';
import { Slider as SliderPrimitive } from '@interop-ui/react-slider';
import cx from 'clsx';

const styles: any = require('./baseStyledPrimitives.module.css');

// Not sure this is how we'd want to style components for the docs site, but this is just to get the
// base styles in place to make the slider functional

const Slider = (React.forwardRef<any, any>((props, ref) => (
  <SliderPrimitive {...props} className={cx(props.className, styles.slider)} ref={ref} />
)) as unknown) as typeof SliderPrimitive;

Slider.Range = React.forwardRef<any, any>((props, ref) => (
  <SliderPrimitive.Range {...props} className={cx(props.className, styles.sliderRange)} ref={ref} />
)) as any;

Slider.Track = React.forwardRef<any, any>((props, ref) => (
  <SliderPrimitive.Track {...props} className={cx(props.className, styles.sliderTrack)} ref={ref} />
)) as any;

Slider.Thumb = React.forwardRef<any, any>((props, ref) => (
  <SliderPrimitive.Thumb {...props} className={cx(props.className, styles.sliderThumb)} ref={ref} />
)) as any;

export { Slider };
