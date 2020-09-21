import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { createContext, createStyleObj, forwardRef } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const PROGRESS_NAME = 'Progress';
const PROGRESS_DEFAULT_TAG = 'div';
const DEFAULT_MAX = 100;

type ProgressState = 'indeterminate' | 'complete' | 'loading';
type ProgressDOMProps = React.ComponentPropsWithoutRef<typeof PROGRESS_DEFAULT_TAG>;
type ProgressOwnProps = {
  value?: number | null | undefined;
  max?: number;
  valueLabel?(value: number): string;
};
type ProgressProps = ProgressOwnProps & Omit<ProgressDOMProps, keyof ProgressOwnProps | 'onChange'>;

type ProgressContextValue = {
  value: number | null;
  max: number;
};

const [ProgressContext, useProgressContext] = createContext<ProgressContextValue>(
  PROGRESS_NAME + 'Context',
  PROGRESS_NAME
);

const Progress = forwardRef<typeof PROGRESS_DEFAULT_TAG, ProgressProps, ProgressStaticProps>(
  function Progress(props, forwardedRef) {
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

    const ctx: ProgressContextValue = React.useMemo(
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
        data-state={getProgressState(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        ref={forwardedRef}
      >
        <ProgressContext.Provider value={ctx}>{children}</ProgressContext.Provider>
      </Comp>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'Progress.Indicator';
const INDICATOR_DEFAULT_TAG = 'div';

type ProgressIndicatorDOMProps = React.ComponentPropsWithoutRef<typeof INDICATOR_DEFAULT_TAG>;
type ProgressIndicatorOwnProps = {};
type ProgressIndicatorProps = ProgressIndicatorDOMProps & ProgressIndicatorOwnProps;

const ProgressIndicator = forwardRef<typeof INDICATOR_DEFAULT_TAG, ProgressIndicatorProps>(
  function ProgressIndicator(props, forwardedRef) {
    const { value, max } = useProgressContext(INDICATOR_NAME);
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return (
      <Comp
        {...indicatorProps}
        {...interopDataAttrObj('indicator')}
        data-state={getProgressState(value, max)}
        data-value={value || undefined}
        data-max={max}
        ref={forwardedRef}
      />
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

function useProgressState() {
  const { value, max } = React.useContext(ProgressContext);
  return getProgressState(value, max);
}

Progress.displayName = PROGRESS_NAME;
ProgressIndicator.displayName = INDICATOR_NAME;

Progress.Indicator = ProgressIndicator;

interface ProgressStaticProps {
  Indicator: typeof ProgressIndicator;
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

export type { ProgressProps, ProgressIndicatorProps, ProgressState };
export { Progress, styles, useProgressState };

function getProgressState(value: number | undefined | null, maxValue: number): ProgressState {
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
