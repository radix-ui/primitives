import * as React from 'react';
import { createContextObj } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const PROGRESS_NAME = 'Progress';
const DEFAULT_MAX = 100;

type ProgressState = 'indeterminate' | 'complete' | 'loading';
type ProgressContextValue = { value: number | null; max: number };
const [ProgressProvider, useProgressContext] = createContextObj<ProgressContextValue>(
  PROGRESS_NAME
);

type ProgressOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
  }
>;

type ProgressPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ProgressOwnProps
>;

const Progress = React.forwardRef((props, forwardedRef) => {
  const {
    selector = getSelector(PROGRESS_NAME),
    value: valueProp,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...progressProps
  } = props;

  const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
  const value = isValidValueNumber(valueProp, max) ? valueProp : null;
  const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

  return (
    <ProgressProvider value={value} max={max}>
      <Primitive
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={isNumber(value) ? value : undefined}
        aria-valuetext={valueLabel}
        role="progressbar"
        data-state={getProgressState(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        {...progressProps}
        selector={selector}
        ref={forwardedRef}
      />
    </ProgressProvider>
  );
}) as ProgressPrimitive;

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

type ProgressIndicatorOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ProgressIndicatorPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  ProgressIndicatorOwnProps
>;

const ProgressIndicator = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(INDICATOR_NAME), ...indicatorProps } = props;
  const context = useProgressContext(INDICATOR_NAME);
  return (
    <Primitive
      data-state={getProgressState(context.value, context.max)}
      data-value={context.value ?? undefined}
      data-max={context.max}
      {...indicatorProps}
      selector={selector}
      ref={forwardedRef}
    />
  );
}) as ProgressIndicatorPrimitive;

ProgressIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

function useProgressState() {
  const context = useProgressContext('useProgressState');
  return getProgressState(context.value, context.max);
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
