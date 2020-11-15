import * as React from 'react';
import { createContext, forwardRef } from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';

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
  const {
    as: Comp = PROGRESS_DEFAULT_TAG,
    children,
    value: valueProp,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...progressProps
  } = props;

  const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
  const value = isValidValueNumber(valueProp, max) ? valueProp : null;

  const ctx: ProgressBarContextValue = React.useMemo(() => ({ value, max }), [value, max]);

  const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

  return (
    <Comp
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={isNumber(value) ? value : undefined}
      aria-valuetext={valueLabel}
      role="progressbar"
      {...progressProps}
      {...getPartDataAttrObj(PROGRESS_NAME)}
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
        {...getPartDataAttrObj(INDICATOR_NAME)}
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

ProgressBar.propTypes = {
  max(props, propName, componentName, location, propFullName) {
    const propValue = props[propName];
    const strVal = String(propValue);
    if (propValue && !isValidMaxNumber(propValue)) {
      return new Error(getInvalidMaxError(strVal, componentName));
    }
    return null;
  },
  value(props, propName, componentName) {
    const valueProp = props[propName];
    const strVal = String(valueProp);
    const max = isValidMaxNumber(props.max) ? props.max : DEFAULT_MAX;
    if (valueProp != null && !isValidValueNumber(valueProp, max)) {
      return new Error(getInvalidValueError(strVal, componentName));
    }
    return null;
  },
};

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
  // prettier-ignore
  return (
    isNumber(max) &&
    !isNaN(max) &&
    max > 0
  );
}

function isValidValueNumber(value: any, max: number): value is number {
  // prettier-ignore
  return (
    isNumber(value) &&
    !isNaN(value) &&
    value <= max &&
    value >= 0
  );
}

// Split this out for clearer readability of the error message.
function getInvalidMaxError(propValue: string, componentName: string) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}

function getInvalidValueError(propValue: string, componentName: string) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` if the progress bar is indeterminate.

Defaulting to \`null\`.`;
}

export { ProgressBar, useProgressBarState };
export type { ProgressBarProps, ProgressBarIndicatorProps, ProgressBarState };
