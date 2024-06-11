import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Progress
 * -----------------------------------------------------------------------------------------------*/

const PROGRESS_NAME = 'Progress';
const DEFAULT_MAX = 100;

type ScopedProps<P> = P & { __scopeProgress?: Scope };
const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);

type ProgressState = 'indeterminate' | 'complete' | 'loading';
type ProgressContextValue = { value: number | null; max: number };
const [ProgressProvider, useProgressContext] =
  createProgressContext<ProgressContextValue>(PROGRESS_NAME);

type ProgressElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ProgressProps extends PrimitiveDivProps {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
}

const Progress = React.forwardRef<ProgressElement, ProgressProps>(
  (props: ScopedProps<ProgressProps>, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;

    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, 'Progress'));
    }

    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;

    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, 'Progress'));
    }

    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : undefined;

    return (
      <ProgressProvider scope={__scopeProgress} value={value} max={max}>
        <Primitive.div
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={isNumber(value) ? value : undefined}
          aria-valuetext={valueLabel}
          role="progressbar"
          data-state={getProgressState(value, max)}
          data-value={value ?? undefined}
          data-max={max}
          {...progressProps}
          ref={forwardedRef}
        />
      </ProgressProvider>
    );
  }
);

Progress.displayName = PROGRESS_NAME;

/* -------------------------------------------------------------------------------------------------
 * ProgressIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ProgressIndicator';

type ProgressIndicatorElement = React.ElementRef<typeof Primitive.div>;
interface ProgressIndicatorProps extends PrimitiveDivProps {}

const ProgressIndicator = React.forwardRef<ProgressIndicatorElement, ProgressIndicatorProps>(
  (props: ScopedProps<ProgressIndicatorProps>, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return (
      <Primitive.div
        data-state={getProgressState(context.value, context.max)}
        data-value={context.value ?? undefined}
        data-max={context.max}
        {...indicatorProps}
        ref={forwardedRef}
      />
    );
  }
);

ProgressIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

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
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}

const Root = Progress;
const Indicator = ProgressIndicator;

export {
  createProgressScope,
  //
  Progress,
  ProgressIndicator,
  //
  Root,
  Indicator,
};
export type { ProgressProps, ProgressIndicatorProps };
