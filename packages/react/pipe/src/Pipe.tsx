import * as React from 'react';

type PipeDOMProps = React.ComponentPropsWithRef<'div'>;
type PipeOwnProps = {};
type PipeProps = PipeDOMProps & PipeOwnProps;

const Pipe = React.forwardRef<HTMLDivElement, PipeProps>(function Pipe(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Pipe.displayName = 'Pipe';

export { Pipe };
export type { PipeProps };
