import * as React from 'react';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, useHasContext, forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type AccessibleIconContextValue = {};
const [AccessibleIconContext] = createContext<AccessibleIconContextValue>(
  'AccessibleIconContext',
  'AccessibleIcon'
);

/* -------------------------------------------------------------------------------------------------
 * AccessibleIcon
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AccessibleIcon';
const DEFAULT_TAG = 'span';

type AccessibleIconDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AccessibleIconOwnProps = { label: string };
type AccessibleIconProps = AccessibleIconDOMProps & AccessibleIconOwnProps;

const AccessibleIcon = forwardRef<typeof DEFAULT_TAG, AccessibleIconProps>(function AccessibleIcon(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, children, label, ...iconProps } = props;
  const child = React.Children.only(children);

  return (
    <AccessibleIconContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...iconProps}>
        {React.cloneElement(child as React.ReactElement, {
          // accessibility
          'aria-hidden': true,
          focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
        })}
        <VisuallyHidden>{label}</VisuallyHidden>
      </Comp>
    </AccessibleIconContext.Provider>
  );
});

AccessibleIcon.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasAccessibleIconContext = () => useHasContext(AccessibleIconContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, useHasAccessibleIconContext, AccessibleIcon };
export type { AccessibleIconProps };
