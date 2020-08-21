import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Button';
const DEFAULT_TAG = 'button';

type ButtonDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ButtonOwnProps = {};
type ButtonProps = ButtonDOMProps & ButtonOwnProps;

const Button = forwardRef<typeof DEFAULT_TAG, ButtonProps>(function Button(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...buttonProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...buttonProps} />;
});

Button.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
    userSelect: 'none',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
});

export { Button, styles };
export type { ButtonProps };
