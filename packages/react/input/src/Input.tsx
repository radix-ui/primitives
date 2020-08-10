import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Input';
const DEFAULT_TAG = 'input';

type InputDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type InputOwnProps = {};
type InputProps = InputDOMProps & InputOwnProps;

const Input = forwardRef<typeof DEFAULT_TAG, InputProps>(function Input(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...inputProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...inputProps} />;
});

Input.displayName = NAME;

const styles: PrimitiveStyles<'input'> = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
};

export { Input, styles };
export type { InputProps };
