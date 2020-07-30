import * as React from 'react';
import pick from 'lodash.pick';
import { cssReset, interopDataAttrObj, isUndefined } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

// TODO: This probably needs to be revisited

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type FlexContextValue = {};
const [FlexContext] = createContext<FlexContextValue>('FlexContext', 'Flex');

/* -------------------------------------------------------------------------------------------------
 * Flex
 * -----------------------------------------------------------------------------------------------*/

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
  const { as: Comp = DEFAULT_TAG, style, children, ...flexProps } = props;
  const gapProps = pick(props, gapPropNames);
  const columnGap = gapProps.gap ?? gapProps.columnGap;
  const rowGap = gapProps.gap ?? gapProps.rowGap;
  const hasGap = !isUndefined(rowGap) || !isUndefined(columnGap);

  return (
    <FlexContext.Provider value={React.useMemo(() => ({}), [])}>
      {hasGap ? (
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
            {...interopDataAttrObj('Flex')}
            ref={forwardedRef}
            {...flexProps}
          >
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;

              // not sure what the plan is here or if we need to reconsider this approach
              const childMarginTop = 0;
              const childMarginLeft = 0;

              const marginLeft = addMargins(
                childMarginLeft,
                !isUndefined(columnGap) ? columnGap : 0
              );
              const marginTop = addMargins(childMarginTop, !isUndefined(rowGap) ? rowGap : 0);

              return <div style={{ marginLeft, marginTop }}>{child}</div>;
            })}
          </Comp>
        </div>
      ) : (
        <Comp {...interopDataAttrObj('Flex')} style={style} ref={forwardedRef} {...flexProps} />
      )}
    </FlexContext.Provider>
  );
});

Flex.displayName = 'Flex';

/* ---------------------------------------------------------------------------------------------- */

const useHasFlexContext = () => useHasContext(FlexContext);

const styles: PrimitiveStyles = {
  flex: {
    ...cssReset(DEFAULT_TAG),
    display: 'flex',
  },
};

export { Flex, styles, useHasFlexContext };
export type { FlexProps };

function addMargins(...margins: Margin[]) {
  const units = margins.map(getUnitFromCSSMargin).filter(Boolean) as string[];
  const nums = margins.map(getIntFromCSSMargin).filter(Boolean) as number[];
  const total = nums.reduce((a, b) => a + b);
  const hasMatchingUnits = units.every((unit) => units.indexOf(unit) === 0);

  if (!hasMatchingUnits) return margins[0];
  return String(total) + units[0];
}

function getUnitFromCSSMargin(margin?: Margin) {
  let unit;

  if (margin) {
    const marginInt = getIntFromCSSMargin(margin);
    const marginIntString = String(marginInt);
    unit = String(margin).replace(marginIntString, '');
  }

  return unit;
}

function getIntFromCSSMargin(margin?: Margin) {
  return typeof margin === 'string' ? parseInt(margin, 10) : margin;
}

type Margin = number | string;
