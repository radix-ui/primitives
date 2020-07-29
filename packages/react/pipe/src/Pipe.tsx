import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type PipeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type PipeOwnProps = {};
type PipeProps = PipeDOMProps & PipeOwnProps;

const Pipe = forwardRef<typeof DEFAULT_TAG, PipeProps>(function Pipe(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...pipeProps } = props;
  return <Comp {...interopDataAttrObj('Pipe')} ref={forwardedRef} {...pipeProps} />;
});

Pipe.displayName = 'Pipe';

const styles: PrimitiveStyles = {
  pipe: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Pipe, styles };
export type { PipeProps };
