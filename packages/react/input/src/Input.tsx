import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Input';
const DEFAULT_TAG = 'input';

type InputDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type InputOwnProps = {};
type InputProps = InputDOMProps & InputOwnProps;

const Input = forwardRef<typeof DEFAULT_TAG, InputProps>(function Input(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...inputProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...inputProps} />;
});

Input.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
});

export { Input, styles };
export type { InputProps };
