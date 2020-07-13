import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'input';

type InputDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type InputOwnProps = {};
type InputProps = InputDOMProps & InputOwnProps;

const Input = forwardRef<typeof DEFAULT_TAG, InputProps>(function Input(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...inputProps } = props;
  return <Comp {...interopDataAttrObj('Input')} ref={forwardedRef} {...inputProps} />;
});

Input.displayName = 'Input';

const styles = {
  input: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
  },
  'input.state.disabled': {
    pointerEvents: 'none',
  },
};

export { Input, styles };
export type { InputProps };
