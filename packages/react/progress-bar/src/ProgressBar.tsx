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
  valueLabel?(value: number): string;
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
    valueLabel: valueLabelProp,
    max: maxProp,
    ...progressProps
  } = props;

  let max = DEFAULT_MAX;
  if (isValidMaxNumber(maxProp)) {
    max = maxProp;
  }

  let value: number | null = null;
  if (isValidValueNumber(valueProp, max)) {
    value = valueProp;
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (maxProp && !isValidMaxNumber(maxProp)) {
        console.warn(
          'An invalid `max` prop was passed to ' +
            PROGRESS_NAME +
            '. Only numbers greater than 0 are valid max values. Defaulting to `' +
            DEFAULT_MAX +
            '`.'
        );
      }
    }, [maxProp]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (valueProp != null && !isValidValueNumber(valueProp, max)) {
        console.warn(
          'An invalid `value` prop was passed to ' +
            PROGRESS_NAME +
            '. The `value` prop must be a positive number that is:\n' +
            ' - a positive number\n' +
            ' - less than the value passed to `max` (or ' +
            DEFAULT_MAX +
            ' if no max prop is set)\n' +
            ' - `null` if the progress bar is indeterminate\n\n' +
            'Defaulting to `null`.'
        );
      }
    }, [valueProp, max]);
  }

  const ctx: ProgressBarContextValue = React.useMemo(
    () => ({
      value,
      max,
    }),
    [value, max]
  );

  let valueLabel: string | undefined;
  if (isNumber(value)) {
    valueLabel = valueLabelProp ? valueLabelProp(value) : `${Math.round(value / max)}%`;
  }

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

export type { ProgressBarProps, ProgressBarIndicatorProps, ProgressBarState };
export { ProgressBar, styles, useProgressBarState };

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
