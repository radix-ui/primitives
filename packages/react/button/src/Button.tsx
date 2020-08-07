import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type ButtonContextValue = {};
const [ButtonContext] = createContext<ButtonContextValue>('ButtonContext', 'Button');

/* -------------------------------------------------------------------------------------------------
 * Button
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Button';
const DEFAULT_TAG = 'button';

type ButtonDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ButtonOwnProps = {};
type ButtonProps = ButtonDOMProps & ButtonOwnProps;

const Button = forwardRef<typeof DEFAULT_TAG, ButtonProps>(function Button(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...buttonProps } = props;
  return (
    <ButtonContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...buttonProps} />
    </ButtonContext.Provider>
  );
});

Button.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasButtonContext = () => useHasContext(ButtonContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',
    userSelect: 'none',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
};

export { Button, styles, useHasButtonContext };
export type { ButtonProps };
