import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'header';

type HeaderDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type HeaderOwnProps = { isSticky?: boolean };
type HeaderProps = HeaderDOMProps & HeaderOwnProps;

const Header = forwardRef<typeof DEFAULT_TAG, HeaderProps>(function Header(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, isSticky = false, style, ...headerProps } = props;
  return (
    <Comp
      {...interopDataAttrObj('Header')}
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
  );
});

Header.displayName = 'Header';

const styles = {
  header: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Header, styles };
export type { HeaderProps };
