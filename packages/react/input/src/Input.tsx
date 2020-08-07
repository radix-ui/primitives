import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type InputContextValue = {};
const [InputContext] = createContext<InputContextValue>('InputContext', 'Input');

/* -------------------------------------------------------------------------------------------------
 * Input
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Input';
const DEFAULT_TAG = 'input';

type InputDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type InputOwnProps = {};
type InputProps = InputDOMProps & InputOwnProps;

const Input = forwardRef<typeof DEFAULT_TAG, InputProps>(function Input(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...inputProps } = props;
  return (
    <InputContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...inputProps} />;
    </InputContext.Provider>
  );
});

Input.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasInputContext = () => useHasContext(InputContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    lineHeight: '1',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
};

export { Input, styles, useHasInputContext };
export type { InputProps };
