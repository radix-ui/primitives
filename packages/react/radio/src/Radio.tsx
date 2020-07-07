import * as React from 'react';

type RadioDOMProps = React.ComponentPropsWithRef<'div'>;
type RadioOwnProps = {};
type RadioProps = RadioDOMProps & RadioOwnProps;

const Radio = React.forwardRef<HTMLDivElement, RadioProps>(function Radio(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Radio.displayName = 'Radio';

export { Radio };
export type { RadioProps };
