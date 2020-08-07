import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type ContainerContextValue = {};
const [ContainerContext] = createContext<ContainerContextValue>('ContainerContext', 'Container');

/* -------------------------------------------------------------------------------------------------
 * Container
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Container';
const DEFAULT_TAG = 'span';

type ContainerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ContainerOwnProps = {};
type ContainerProps = ContainerDOMProps & ContainerOwnProps;

const Container = forwardRef<typeof DEFAULT_TAG, ContainerProps>(function Container(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...containerProps } = props;
  return (
    <ContainerContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...containerProps} />
    </ContainerContext.Provider>
  );
});

Container.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasContainerContext = () => useHasContext(ContainerContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1, // make sure the element is always full-width
  },
};

export { Container, styles, useHasContainerContext };
export type { ContainerProps };
