import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'button';

type ButtonDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ButtonOwnProps = {};
type ButtonProps = ButtonDOMProps & ButtonOwnProps;

const Button = forwardRef<typeof DEFAULT_TAG, ButtonProps>(function Button(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...buttonProps } = props;
  return <Comp {...interopDataAttrObj('Button')} ref={forwardedRef} {...buttonProps} />;
});

Button.displayName = 'Button';

const styles = {
  button: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
    userSelect: 'none',
  },
  'button.state.disabled': {
    pointerEvents: 'none',
  },
};

export { Button, styles };
export type { ButtonProps };
