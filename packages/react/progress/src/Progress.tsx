import * as React from 'react';
import { createContext } from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const PROGRESS_NAME = 'Progress';
const DEFAULT_MAX = 100;

type ProgressState = 'indeterminate' | 'complete' | 'loading';
type ProgressContextValue = { value: number | null; max: number };
const [ProgressContext, useProgressContext] = createContext<ProgressContextValue>(
  PROGRESS_NAME + 'Context',
  PROGRESS_NAME
);

type ProgressOwnProps = {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
};

const Progress = forwardRefWithAs<typeof Primitive, ProgressOwnProps>((props, forwardedRef) => {
  const {
    children,
    value: valueProp,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...progressProps
  } = props;

  const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
  const value = isValidValueNumber(valueProp, max) ? valueProp : null;
  const ctx: ProgressContextValue = React.useMemo(() => ({ value, max }), [value, max]);
  const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

  return (
    <Primitive
      selector={getSelector(PROGRESS_NAME)}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={isNumber(value) ? value : undefined}
      aria-valuetext={valueLabel}
      role="progressbar"
      {...progressProps}
      data-state={getProgressState(value, max)}
      data-value={value ?? undefined}
      data-max={max}
      ref={forwardedRef}
    >
      <ProgressContext.Provider value={ctx}>{children}</ProgressContext.Provider>
    </Primitive>
  );
});

Progress.displayName = PROGRESS_NAME;

Progress.propTypes = {
  max(props, propName, componentName) {
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

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressIndicator';

const ProgressIndicator = forwardRefWithAs<typeof Primitive>((props, forwardedRef) => {
  const { value, max } = useProgressContext(INDICATOR_NAME);
  return (
    <Primitive
      selector={getSelector(INDICATOR_NAME)}
      {...props}
      data-state={getProgressState(value, max)}
      data-value={value || undefined}
      data-max={max}
      ref={forwardedRef}
    />
  );
});

ProgressIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function useProgressState() {
  const { value, max } = React.useContext(ProgressContext);
  return getProgressState(value, max);
}

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function getProgressState(value: number | undefined | null, maxValue: number): ProgressState {
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
  - \`null\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}

const Root = Progress;
const Indicator = ProgressIndicator;

export {
  Progress,
  ProgressIndicator,
  //
  Root,
  Indicator,
  //
  useProgressState,
};
