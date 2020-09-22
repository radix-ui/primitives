import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { createContext, createStyleObj, forwardRef } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * ProgressBar
 * -----------------------------------------------------------------------------------------------*/

const PROGRESS_NAME = 'ProgressBar';
const PROGRESS_DEFAULT_TAG = 'div';
const DEFAULT_MAX = 100;

type ProgressBarState = 'indeterminate' | 'complete' | 'loading';
type ProgressBarDOMProps = React.ComponentPropsWithoutRef<typeof PROGRESS_DEFAULT_TAG>;
type ProgressBarOwnProps = {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
};
type ProgressBarProps = ProgressBarOwnProps & ProgressBarDOMProps;

type ProgressBarContextValue = {
  value: number | null;
  max: number;
};

const [ProgressBarContext, useProgressBarContext] = createContext<ProgressBarContextValue>(
  PROGRESS_NAME + 'Context',
  PROGRESS_NAME
);

const ProgressBar = forwardRef<
  typeof PROGRESS_DEFAULT_TAG,
  ProgressBarProps,
  ProgressBarStaticProps
>(function ProgressBar(props, forwardedRef) {
  let {
    as: Comp = PROGRESS_DEFAULT_TAG,
    children,
    value: valueProp,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...progressProps
  } = props;

  let max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
  let value = isValidValueNumber(valueProp, max) ? valueProp : null;

  const ctx: ProgressBarContextValue = React.useMemo(
    () => ({
      value,
      max,
    }),
    [value, max]
  );

  let valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

  return (
    <Comp
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={isNumber(value) ? value : undefined}
      aria-valuetext={valueLabel}
      role="progressbar"
      {...progressProps}
      {...interopDataAttrObj('root')}
      data-state={getProgressBarState(value, max)}
      data-value={value ?? undefined}
      data-max={max}
      ref={forwardedRef}
    >
      <ProgressBarContext.Provider value={ctx}>{children}</ProgressBarContext.Provider>
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ProgressBarIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressBar.Indicator';
const INDICATOR_DEFAULT_TAG = 'div';

type ProgressBarIndicatorDOMProps = React.ComponentPropsWithoutRef<typeof INDICATOR_DEFAULT_TAG>;
type ProgressBarIndicatorOwnProps = {};
type ProgressBarIndicatorProps = ProgressBarIndicatorDOMProps & ProgressBarIndicatorOwnProps;

const ProgressBarIndicator = forwardRef<typeof INDICATOR_DEFAULT_TAG, ProgressBarIndicatorProps>(
  function ProgressBarIndicator(props, forwardedRef) {
    const { value, max } = useProgressBarContext(INDICATOR_NAME);
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return (
      <Comp
        {...indicatorProps}
        {...interopDataAttrObj('indicator')}
        data-state={getProgressBarState(value, max)}
        data-value={value || undefined}
        data-max={max}
        ref={forwardedRef}
      />
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

function useProgressBarState() {
  const { value, max } = React.useContext(ProgressBarContext);
  return getProgressBarState(value, max);
}

ProgressBar.displayName = PROGRESS_NAME;
ProgressBarIndicator.displayName = INDICATOR_NAME;

ProgressBar.Indicator = ProgressBarIndicator;

interface ProgressBarStaticProps {
  Indicator: typeof ProgressBarIndicator;
}

const [styles, interopDataAttrObj] = createStyleObj(PROGRESS_NAME, {
  root: {
    ...cssReset(PROGRESS_DEFAULT_TAG),
    position: 'relative',
  },
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
});

ProgressBar.propTypes = {
  max(props, propName, componentName, location, propFullName) {
    let propValue = props[propName];
    let strVal = String(propValue);
    if (propValue && !isValidMaxNumber(propValue)) {
      return new Error(
        `Invalid ${location} \`${propFullName}\` of value \`${strVal}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`
      );
    }
    return null;
  },
  value(props, propName, componentName, location, propFullName) {
    let valueProp = props[propName];
    let strVal = String(valueProp);
    let max = isValidMaxNumber(props.max) ? props.max : DEFAULT_MAX;
    if (valueProp != null && !isValidValueNumber(valueProp, max)) {
      return new Error(
        `Invalid ${location} \`${propFullName}\` of value \`${strVal}\` supplied to \`${componentName}\`. The \`value\` prop must be:
 - a positive number
 - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no max prop is set)
 - \`null\` if the progress bar is indeterminate.

Defaulting to \`null\`.`
      );
    }
    return null;
  },
};

export type { ProgressBarProps, ProgressBarIndicatorProps, ProgressBarState };
export { ProgressBar, styles, useProgressBarState };

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function getProgressBarState(value: number | undefined | null, maxValue: number): ProgressBarState {
  return value == null ? 'indeterminate' : value === maxValue ? 'complete' : 'loading';
}

function isNumber(value: any): value is number {
  return typeof value === 'number';
}

function isValidMaxNumber(max: any): max is number {
  return (
    // is a number
    isNumber(max) &&
    // isn't NaN
    !isNaN(max) &&
    // is greater than zero
    max > 0
  );
}

function isValidValueNumber(value: any, max: number): value is number {
  return (
    // is a number
    isNumber(value) &&
    // isn't NaN
    !isNaN(value) &&
    // isn't bigger than our max value
    value <= max &&
    // isn't less than zero
    value >= 0
  );
}
