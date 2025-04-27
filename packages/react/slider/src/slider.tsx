import * as React from 'react';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useDirection } from '@radix-ui/react-direction';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';
import { createCollection } from '@radix-ui/react-collection';

import type { Scope } from '@radix-ui/react-context';

type Direction = 'ltr' | 'rtl';

const PAGE_KEYS = ['PageUp', 'PageDown'];
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

type SlideDirection = 'from-left' | 'from-right' | 'from-bottom' | 'from-top';
const BACK_KEYS: Record<SlideDirection, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
};

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

const SLIDER_NAME = 'Slider';

const [Collection, useCollection, createCollectionScope] =
  createCollection<SliderThumbElement>(SLIDER_NAME);

type ScopedProps<P> = P & { __scopeSlider?: Scope };
const [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME, [
  createCollectionScope,
]);

type SliderContextValue = {
  name: string | undefined;
  disabled: boolean | undefined;
  min: number;
  max: number;
  values: number[];
  valueIndexToChangeRef: React.MutableRefObject<number>;
  thumbs: Set<SliderThumbElement>;
  orientation: SliderProps['orientation'];
  form: string | undefined;
};

const [SliderProvider, useSliderContext] = createSliderContext<SliderContextValue>(SLIDER_NAME);

type SliderElement = SliderHorizontalElement | SliderVerticalElement;
interface SliderProps
  extends Omit<
    SliderHorizontalProps | SliderVerticalProps,
    keyof SliderOrientationPrivateProps | 'defaultValue'
  > {
  name?: string;
  disabled?: boolean;
  orientation?: React.AriaAttributes['aria-orientation'];
  dir?: Direction;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?(value: number[]): void;
  onValueCommit?(value: number[]): void;
  inverted?: boolean;
  form?: string;
}

const Slider = React.forwardRef<SliderElement, SliderProps>(
  (props: ScopedProps<SliderProps>, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = 'horizontal',
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {},
      onValueCommit = () => {},
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set());
    const valueIndexToChangeRef = React.useRef<number>(0);
    const isHorizontal = orientation === 'horizontal';
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;

    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value) => {
        const thumbs = [...thumbRefs.current];
        thumbs[valueIndexToChangeRef.current]?.focus();
        onValueChange(value);
      },
    });
    const valuesBeforeSlideStartRef = React.useRef(values);

    function handleSlideStart(value: number) {
      const closestIndex = getClosestValueIndex(values, value);
      updateValues(value, closestIndex);
    }

    function handleSlideMove(value: number) {
      updateValues(value, valueIndexToChangeRef.current);
    }

    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }

    function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);

      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }

    return (
      <SliderProvider
        scope={props.__scopeSlider}
        name={name}
        disabled={disabled}
        min={min}
        max={max}
        valueIndexToChangeRef={valueIndexToChangeRef}
        thumbs={thumbRefs.current}
        values={values}
        orientation={orientation}
        form={form}
      >
        <Collection.Provider scope={props.__scopeSlider}>
          <Collection.Slot scope={props.__scopeSlider}>
            <SliderOrientation
              aria-disabled={disabled}
              data-disabled={disabled ? '' : undefined}
              {...sliderProps}
              ref={forwardedRef}
              onPointerDown={composeEventHandlers(sliderProps.onPointerDown, () => {
                if (!disabled) valuesBeforeSlideStartRef.current = values;
              })}
              min={min}
              max={max}
              inverted={inverted}
              onSlideStart={disabled ? undefined : handleSlideStart}
              onSlideMove={disabled ? undefined : handleSlideMove}
              onSlideEnd={disabled ? undefined : handleSlideEnd}
              onHomeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
              onEndKeyDown={() =>
                !disabled && updateValues(max, values.length - 1, { commit: true })
              }
              onStepKeyDown={({ event, direction: stepDirection }) => {
                if (!disabled) {
                  const isPageKey = PAGE_KEYS.includes(event.key);
                  const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
                  const multiplier = isSkipKey ? 10 : 1;
                  const atIndex = valueIndexToChangeRef.current;
                  const value = values[atIndex]!;
                  const stepInDirection = step * multiplier * stepDirection;
                  updateValues(value + stepInDirection, atIndex, { commit: true });
                }
              }}
            />
          </Collection.Slot>
        </Collection.Provider>
      </SliderProvider>
    );
  }
);

Slider.displayName = SLIDER_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

type Side = 'top' | 'right' | 'bottom' | 'left';

const [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext<{
  startEdge: Side;
  endEdge: Side;
  size: keyof NonNullable<ReturnType<typeof useSize>>;
  direction: number;
}>(SLIDER_NAME, {
  startEdge: 'left',
  endEdge: 'right',
  size: 'width',
  direction: 1,
});

type SliderOrientationPrivateProps = {
  min: number;
  max: number;
  inverted: boolean;
  onSlideStart?(value: number): void;
  onSlideMove?(value: number): void;
  onSlideEnd?(): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void;
};
interface SliderOrientationProps
  extends Omit<SliderImplProps, keyof SliderImplPrivateProps>,
    SliderOrientationPrivateProps {}

type SliderHorizontalElement = SliderImplElement;
interface SliderHorizontalProps extends SliderOrientationProps {
  dir?: Direction;
}

const SliderHorizontal = React.forwardRef<SliderHorizontalElement, SliderHorizontalProps>(
  (props: ScopedProps<SliderHorizontalProps>, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = React.useState<SliderImplElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = React.useRef<DOMRect>(undefined);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === 'ltr';
    const isSlidingFromLeft = (isDirectionLTR && !inverted) || (!isDirectionLTR && inverted);

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.current || slider!.getBoundingClientRect();
      const input: [number, number] = [0, rect.width];
      const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);

      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge={isSlidingFromLeft ? 'left' : 'right'}
        endEdge={isSlidingFromLeft ? 'right' : 'left'}
        direction={isSlidingFromLeft ? 1 : -1}
        size="width"
      >
        <SliderImpl
          dir={direction}
          data-orientation="horizontal"
          {...sliderProps}
          ref={composedRefs}
          style={{
            ...sliderProps.style,
            ['--radix-slider-thumb-transform' as any]: 'translateX(-50%)',
          }}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.clientX);
            onSlideStart?.(value);
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.clientX);
            onSlideMove?.(value);
          }}
          onSlideEnd={() => {
            rectRef.current = undefined;
            onSlideEnd?.();
          }}
          onStepKeyDown={(event) => {
            const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right';
            const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
          }}
        />
      </SliderOrientationProvider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderVertical
 * -----------------------------------------------------------------------------------------------*/

type SliderVerticalElement = SliderImplElement;
interface SliderVerticalProps extends SliderOrientationProps {}

const SliderVertical = React.forwardRef<SliderVerticalElement, SliderVerticalProps>(
  (props: ScopedProps<SliderVerticalProps>, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = React.useRef<SliderImplElement>(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = React.useRef<DOMRect>(undefined);
    const isSlidingFromBottom = !inverted;

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.current || sliderRef.current!.getBoundingClientRect();
      const input: [number, number] = [0, rect.height];
      const output: [number, number] = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);

      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge={isSlidingFromBottom ? 'bottom' : 'top'}
        endEdge={isSlidingFromBottom ? 'top' : 'bottom'}
        size="height"
        direction={isSlidingFromBottom ? 1 : -1}
      >
        <SliderImpl
          data-orientation="vertical"
          {...sliderProps}
          ref={ref}
          style={{
            ...sliderProps.style,
            ['--radix-slider-thumb-transform' as any]: 'translateY(50%)',
          }}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.clientY);
            onSlideStart?.(value);
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.clientY);
            onSlideMove?.(value);
          }}
          onSlideEnd={() => {
            rectRef.current = undefined;
            onSlideEnd?.();
          }}
          onStepKeyDown={(event) => {
            const slideDirection = isSlidingFromBottom ? 'from-bottom' : 'from-top';
            const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
          }}
        />
      </SliderOrientationProvider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

type SliderImplElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
type SliderImplPrivateProps = {
  onSlideStart(event: React.PointerEvent): void;
  onSlideMove(event: React.PointerEvent): void;
  onSlideEnd(event: React.PointerEvent): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(event: React.KeyboardEvent): void;
};
interface SliderImplProps extends PrimitiveDivProps, SliderImplPrivateProps {}

const SliderImpl = React.forwardRef<SliderImplElement, SliderImplProps>(
  (props: ScopedProps<SliderImplProps>, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);

    return (
      <Primitive.span
        {...sliderProps}
        ref={forwardedRef}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === 'Home') {
            onHomeKeyDown(event);
            // Prevent scrolling to page start
            event.preventDefault();
          } else if (event.key === 'End') {
            onEndKeyDown(event);
            // Prevent scrolling to page end
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            // Prevent scrolling for directional key presses
            event.preventDefault();
          }
        })}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target as HTMLElement;
          target.setPointerCapture(event.pointerId);
          // Prevent browser focus behaviour because we focus a thumb manually when values change.
          event.preventDefault();
          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        })}
        onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target as HTMLElement;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target as HTMLElement;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'SliderTrack';

type SliderTrackElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SliderTrackProps extends PrimitiveSpanProps {}

const SliderTrack = React.forwardRef<SliderTrackElement, SliderTrackProps>(
  (props: ScopedProps<SliderTrackProps>, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return (
      <Primitive.span
        data-disabled={context.disabled ? '' : undefined}
        data-orientation={context.orientation}
        {...trackProps}
        ref={forwardedRef}
      />
    );
  }
);

SliderTrack.displayName = TRACK_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'SliderRange';

type SliderRangeElement = React.ElementRef<typeof Primitive.span>;
interface SliderRangeProps extends PrimitiveSpanProps {}

const SliderRange = React.forwardRef<SliderRangeElement, SliderRangeProps>(
  (props: ScopedProps<SliderRangeProps>, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map((value) =>
      convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);

    return (
      <Primitive.span
        data-orientation={context.orientation}
        data-disabled={context.disabled ? '' : undefined}
        {...rangeProps}
        ref={composedRefs}
        style={{
          ...props.style,
          [orientation.startEdge]: offsetStart + '%',
          [orientation.endEdge]: offsetEnd + '%',
        }}
      />
    );
  }
);

SliderRange.displayName = RANGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SliderThumb';

type SliderThumbElement = SliderThumbImplElement;
interface SliderThumbProps extends Omit<SliderThumbImplProps, 'index'> {}

const SliderThumb = React.forwardRef<SliderThumbElement, SliderThumbProps>(
  (props: ScopedProps<SliderThumbProps>, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = React.useState<SliderThumbImplElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = React.useMemo(
      () => (thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1),
      [getItems, thumb]
    );
    return <SliderThumbImpl {...props} ref={composedRefs} index={index} />;
  }
);

type SliderThumbImplElement = React.ElementRef<typeof Primitive.span>;
interface SliderThumbImplProps extends PrimitiveSpanProps {
  index: number;
  name?: string;
}

const SliderThumbImpl = React.forwardRef<SliderThumbImplElement, SliderThumbImplProps>(
  (props: ScopedProps<SliderThumbImplProps>, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = thumb ? context.form || !!thumb.closest('form') : true;
    const size = useSize(thumb);
    // We cast because index could be `-1` which would return undefined
    const value = context.values[index] as number | undefined;
    const percent =
      value === undefined ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size?.[orientation.size];
    const thumbInBoundsOffset = orientationSize
      ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction)
      : 0;

    React.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);

    return (
      <span
        style={{
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}
      >
        <Collection.ItemSlot scope={props.__scopeSlider}>
          <Primitive.span
            role="slider"
            aria-label={props['aria-label'] || label}
            aria-valuemin={context.min}
            aria-valuenow={value}
            aria-valuemax={context.max}
            aria-orientation={context.orientation}
            data-orientation={context.orientation}
            data-disabled={context.disabled ? '' : undefined}
            tabIndex={context.disabled ? undefined : 0}
            {...thumbProps}
            ref={composedRefs}
            /**
             * There will be no value on initial render while we work out the index so we hide thumbs
             * without a value, otherwise SSR will render them in the wrong position before they
             * snap into the correct position during hydration which would be visually jarring for
             * slower connections.
             */
            style={value === undefined ? { display: 'none' } : props.style}
            onFocus={composeEventHandlers(props.onFocus, () => {
              context.valueIndexToChangeRef.current = index;
            })}
          />
        </Collection.ItemSlot>

        {isFormControl && (
          <SliderBubbleInput
            key={index}
            name={
              name ??
              (context.name ? context.name + (context.values.length > 1 ? '[]' : '') : undefined)
            }
            form={context.form}
            value={value}
          />
        )}
      </span>
    );
  }
);

SliderThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'RadioBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface SliderBubbleInputProps extends InputProps {}

const SliderBubbleInput = React.forwardRef<HTMLInputElement, SliderBubbleInputProps>(
  ({ __scopeSlider, value, ...props }: ScopedProps<SliderBubbleInputProps>, forwardedRef) => {
    const ref = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);

    // Bubble value change to parents (e.g form change event)
    React.useEffect(() => {
      const input = ref.current;
      if (!input) return;

      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor;
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event('input', { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);

    /**
     * We purposefully do not use `type="hidden"` here otherwise forms that
     * wrap it will not be able to access its value via the FormData API.
     *
     * We purposefully do not add the `value` attribute here to allow the value
     * to be set programmatically and bubble to any parent form `onChange` event.
     * Adding the `value` will cause React to consider the programmatic
     * dispatch a duplicate and it will get swallowed.
     */
    return (
      <Primitive.input
        style={{ display: 'none' }}
        {...props}
        ref={composedRefs}
        defaultValue={value}
      />
    );
  }
);

SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}

/**
 * Returns a label for each thumb when there are two or more thumbs
 */
function getLabel(index: number, totalValues: number) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ['Minimum', 'Maximum'][index];
  } else {
    return undefined;
  }
}

/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}

/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1]! - value);
}

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}

function getDecimalCount(value: number) {
  return (String(value).split('.')[1] || '').length;
}

function roundValue(value: number, decimalCount: number) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}

const Root = Slider;
const Track = SliderTrack;
const Range = SliderRange;
const Thumb = SliderThumb;

export {
  createSliderScope,
  //
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
  //
  Root,
  Track,
  Range,
  Thumb,
};
export type { SliderProps, SliderTrackProps, SliderRangeProps, SliderThumbProps };
