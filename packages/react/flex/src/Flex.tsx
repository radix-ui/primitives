import * as React from 'react';
import { cssReset, interopDataAttrObj, isUndefined, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';
import pick from 'lodash.pick';

const NAME = 'Flex';
const DEFAULT_TAG = 'div';

type FlexDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type FlexOwnProps = {
  rowGap?: number;
  columnGap?: number;
  gap?: number;
};
type FlexProps = FlexDOMProps & FlexOwnProps;

const gapPropNames = ['columnGap', 'rowGap', 'gap'] as const;

const Flex = forwardRef<typeof DEFAULT_TAG, FlexProps>(function Flex(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, style, ...flexProps } = props;
  const gapProps = pick(props, gapPropNames);
  const columnGap = gapProps.gap ?? gapProps.columnGap;
  const rowGap = gapProps.gap ?? gapProps.rowGap;
  const hasGap = !isUndefined(rowGap) || !isUndefined(columnGap);

  if (hasGap) {
    return (
      <div
        {...interopDataAttrObj('FlexWrapper')}
        style={{
          overflow: 'hidden',
          flexGrow: 1,
          marginTop: !isUndefined(rowGap) ? rowGap : undefined,
          marginLeft: !isUndefined(columnGap) ? columnGap : undefined,
        }}
      >
        <Comp
          style={{
            ...style,
            marginTop: !isUndefined(rowGap) ? -rowGap : undefined,
            marginLeft: !isUndefined(columnGap) ? -columnGap : undefined,
          }}
          {...interopDataAttrObj(NAME)}
          ref={forwardedRef}
          {...flexProps}
        />
      </div>
    );
  }

  return <Comp {...interopDataAttrObj(NAME)} style={style} ref={forwardedRef} {...flexProps} />;
});

Flex.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    display: 'flex',
  },
};

export { Flex, styles };
export type { FlexProps };
