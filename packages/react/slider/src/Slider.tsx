import * as React from 'react';

type SliderDOMProps = React.ComponentPropsWithRef<'div'>;
type SliderOwnProps = {};
type SliderProps = SliderDOMProps & SliderOwnProps;

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
