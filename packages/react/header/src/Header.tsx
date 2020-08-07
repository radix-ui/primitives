import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type HeaderContextValue = {};
const [HeaderContext] = createContext<HeaderContextValue>('HeaderContext', 'Header');

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Header';
const DEFAULT_TAG = 'header';

type HeaderDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type HeaderOwnProps = { isSticky?: boolean };
type HeaderProps = HeaderDOMProps & HeaderOwnProps;

const Header = forwardRef<typeof DEFAULT_TAG, HeaderProps>(function Header(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, isSticky = false, style, ...headerProps } = props;
  return (
    <HeaderContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp
        {...interopDataAttrObj(NAME)}
        style={{
          ...style,
          ...(isSticky
            ? {
                position: 'sticky',
                top: 0,
              }
            : {}),
        }}
        ref={forwardedRef}
        {...headerProps}
      />
    </HeaderContext.Provider>
  );
});

Header.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasHeaderContext = () => useHasContext(HeaderContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Header, styles, useHasHeaderContext };
export type { HeaderProps };
