import * as React from 'react';
import omit from 'lodash.omit';
import { cssReset, isUndefined } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Flex
 * -----------------------------------------------------------------------------------------------*/

const FLEX_NAME = 'Flex';
const FLEX_DEFAULT_TAG = 'div';
const GAP_PROP_NAMES = ['rowGap', 'columnGap', 'gap'];

type FlexDOMProps = React.ComponentPropsWithoutRef<typeof FLEX_DEFAULT_TAG>;
type FlexOwnProps = { rowGap?: number; columnGap?: number; gap?: number };
type FlexProps = FlexDOMProps & FlexOwnProps;

interface FlexStaticProps {
  Item: typeof FlexItem;
}

const FlexContext = React.createContext<{
  rowGap?: number;
  columnGap?: number;
}>(null as any);

const Flex = forwardRef<typeof FLEX_DEFAULT_TAG, FlexProps, FlexStaticProps>(function Flex(
  props,
  forwardedRef
) {
  const { as: Comp = FLEX_DEFAULT_TAG, style, children, ...restProps } = props;
  const flexProps = omit(restProps, GAP_PROP_NAMES);
  const columnGap = props.gap ?? props.columnGap;
  const rowGap = props.gap ?? props.rowGap;
  const hasGap = !isUndefined(rowGap) || !isUndefined(columnGap);
  const context = React.useMemo(() => ({ columnGap, rowGap }), [columnGap, rowGap]);

  if (hasGap) {
    return (
      <div style={{ overflow: 'hidden', flexGrow: 1 }}>
        <Comp
          {...flexProps}
          {...interopDataAttrObj('root')}
          ref={forwardedRef}
          style={{
            ...style,
            marginTop: isUndefined(rowGap) ? undefined : -rowGap,
            marginLeft: isUndefined(columnGap) ? undefined : -columnGap,
          }}
        >
          <FlexContext.Provider value={context}>{children}</FlexContext.Provider>
        </Comp>
      </div>
    );
  }

  return (
    <Comp {...flexProps} {...interopDataAttrObj('root')} style={style} ref={forwardedRef}>
      {children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * FlexItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'Flex.Item';
const ITEM_DEFAULT_TAG = 'div';

type FlexItemDOMProps = React.ComponentPropsWithoutRef<typeof ITEM_DEFAULT_TAG>;
type FlexItemOwnProps = { xOffset?: number; yOffset?: number };
type FlexItemProps = FlexItemDOMProps & FlexItemOwnProps;

const FlexItem = forwardRef<typeof ITEM_DEFAULT_TAG, FlexItemProps>(function FlexItem(
  props,
  forwardedRef
) {
  const { as: Comp = ITEM_DEFAULT_TAG, style, xOffset = 0, yOffset = 0, ...itemProps } = props;
  const { rowGap, columnGap } = React.useContext(FlexContext) || {};

  return (
    <Comp
      {...itemProps}
      {...interopDataAttrObj('item')}
      ref={forwardedRef}
      style={{
        ...style,
        marginTop: isUndefined(rowGap) ? undefined : rowGap + yOffset,
        marginLeft: isUndefined(columnGap) ? undefined : columnGap + xOffset,
      }}
    />
  );
});

Flex.Item = FlexItem;

Flex.displayName = FLEX_NAME;
Flex.Item.displayName = ITEM_NAME;

const [styles, interopDataAttrObj] = createStyleObj(FLEX_NAME, {
  root: {
    ...cssReset(FLEX_DEFAULT_TAG),
    display: 'flex',
  },
  item: {
    ...cssReset(ITEM_DEFAULT_TAG),
    flex: 1,
  },
});

export { Flex, styles };
export type { FlexProps, FlexItemProps };
