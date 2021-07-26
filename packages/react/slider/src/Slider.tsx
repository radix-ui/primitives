import * as React from 'react';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useDirection } from '@radix-ui/react-use-direction';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';
import { createCollection } from '@radix-ui/react-collection';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type Direction = 'ltr' | 'rtl';

const PAGE_KEYS = ['PageUp', 'PageDown'];
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const BACK_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowDown', 'Home', 'ArrowLeft', 'PageDown'],
  rtl: ['ArrowDown', 'Home', 'ArrowRight', 'PageDown'],
};

const [CollectionProvider, CollectionSlot, CollectionItemSlot, useCollection] = createCollection<
  React.ElementRef<typeof SliderThumb>,
  {}
>();

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

const SLIDER_NAME = 'Slider';
const SLIDER_DEFAULT_TAG = 'span';

type SliderContextValue = {
  disabled?: boolean;
  min: number;
  max: number;
  values: number[];
  valueIndexToChangeRef: React.MutableRefObject<number>;
  thumbs: Set<React.ElementRef<typeof SliderThumb>>;
  orientation: SliderOwnProps['orientation'];
};

const [SliderProvider, useSliderContext] = createContext<SliderContextValue>(SLIDER_NAME);

type SliderOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
  }
>;

type SliderPrimitive = Polymorphic.ForwardRefComponent<typeof SLIDER_DEFAULT_TAG, SliderOwnProps>;

const Slider = React.forwardRef((props, forwardedRef) => {
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
    ...sliderProps
  } = props;
  const [slider, setSlider] = React.useState<HTMLSpanElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
  const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set());
  const valueIndexToChangeRef = React.useRef<number>(0);
  const isHorizontal = orientation === 'horizontal';
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = slider ? Boolean(slider.closest('form')) : true;
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

  function handleSlideStart(value: number) {
    const closestIndex = getClosestValueIndex(values, value);
    updateValues(value, closestIndex);
  }

  function handleSlideMove(value: number) {
    updateValues(value, valueIndexToChangeRef.current);
  }

  function updateValues(value: number, atIndex: number) {
    const decimalCount = getDecimalCount(step);
    const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
    const nextValue = clamp(snapToStep, [min, max]);

    setValues((prevValues = []) => {
      const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
      if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
        valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
        return String(nextValues) === String(prevValues) ? prevValues : nextValues;
      } else {
        return prevValues;
      }
    });
  }

  return (
    <SliderProvider
      disabled={disabled}
      min={min}
      max={max}
      valueIndexToChangeRef={valueIndexToChangeRef}
      thumbs={thumbRefs.current}
      values={values}
      orientation={orientation}
    >
      <CollectionProvider>
        <CollectionSlot>
          <SliderOrientation
            aria-disabled={disabled}
            data-disabled={disabled ? '' : undefined}
            {...sliderProps}
            ref={composedRefs}
            min={min}
            max={max}
            onSlideStart={disabled ? undefined : handleSlideStart}
            onSlideMove={disabled ? undefined : handleSlideMove}
            onHomeKeyDown={() => !disabled && updateValues(min, 0)}
            onEndKeyDown={() => !disabled && updateValues(max, values.length - 1)}
            onStepKeyDown={({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value + stepInDirection, atIndex);
              }
            }}
          />
        </CollectionSlot>
      </CollectionProvider>
      {isFormControl &&
        values.map((value, index) => (
          <BubbleInput
            key={index}
            name={name ? name + (values.length > 1 ? '[]' : '') : undefined}
            value={value}
          />
        ))}
    </SliderProvider>
  );
}) as SliderPrimitive;

Slider.displayName = SLIDER_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

const SliderOrientationContext = React.createContext<{
  startEdge: 'bottom' | 'left' | 'right';
  endEdge: 'top' | 'right' | 'left';
  size: keyof NonNullable<ReturnType<typeof useSize>>;
  direction: number;
}>({} as any);

type SliderOrientationPartOwnProps = Omit<
  Polymorphic.OwnProps<typeof SliderImpl>,
  | 'onSlideStart'
  | 'onSlideMove'
  | 'onSlideEnd'
  | 'onSlideTouchStart'
  | 'onSlideTouchMove'
  | 'onSlideTouchEnd'
>;
type SliderOrientationOwnProps = Polymorphic.Merge<
  SliderOrientationPartOwnProps,
  {
    min: number;
    max: number;
    onSlideStart?(value: number): void;
    onSlideMove?(value: number): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void;
  }
>;

type SliderHorizontalOwnProps = SliderOrientationOwnProps & { dir?: Direction };
type SliderHorizontalPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SliderImpl>,
  SliderHorizontalOwnProps
>;

const SliderHorizontal = React.forwardRef((props, forwardedRef) => {
  const { min, max, dir, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props;
  const [slider, setSlider] = React.useState<React.ElementRef<typeof SliderImpl> | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
  const rectRef = React.useRef<ClientRect>();
  const direction = useDirection(slider, dir);
  const isDirectionLTR = direction === 'ltr';

  function getValueFromPointer(pointerPosition: number) {
    const rect = rectRef.current || slider!.getBoundingClientRect();
    const input: [number, number] = [0, rect.width];
    const output: [number, number] = isDirectionLTR ? [min, max] : [max, min];
    const value = linearScale(input, output);

    rectRef.current = rect;
    return value(pointerPosition - rect.left);
  }

  return (
    <SliderOrientationContext.Provider
      value={React.useMemo(
        () => ({
          startEdge: isDirectionLTR ? 'left' : 'right',
          endEdge: isDirectionLTR ? 'right' : 'left',
          direction: isDirectionLTR ? 1 : -1,
          size: 'width',
        }),
        [isDirectionLTR]
      )}
    >
      <SliderImpl
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
        onSlideEnd={() => (rectRef.current = undefined)}
        onStepKeyDown={(event) => {
          const isBackKey = BACK_KEYS[direction].includes(event.key);
          onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
        }}
      />
    </SliderOrientationContext.Provider>
  );
}) as SliderHorizontalPrimitive;

/* -------------------------------------------------------------------------------------------------
 * SliderVertical
 * -----------------------------------------------------------------------------------------------*/

type SliderVerticalOwnProps = SliderOrientationOwnProps;
type SliderVerticalPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SliderImpl>,
  SliderVerticalOwnProps
>;

const SliderVertical = React.forwardRef((props, forwardedRef) => {
  const { min, max, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props;
  const sliderRef = React.useRef<React.ElementRef<typeof SliderImpl>>(null);
  const ref = useComposedRefs(forwardedRef, sliderRef);
  const rectRef = React.useRef<ClientRect>();

  function getValueFromPointer(pointerPosition: number) {
    const rect = rectRef.current || sliderRef.current!.getBoundingClientRect();
    const input: [number, number] = [0, rect.height];
    const output: [number, number] = [max, min];
    const value = linearScale(input, output);

    rectRef.current = rect;
    return value(pointerPosition - rect.top);
  }

  return (
    <SliderOrientationContext.Provider
      value={React.useMemo(
        () => ({ startEdge: 'bottom', endEdge: 'top', size: 'height', direction: 1 }),
        []
      )}
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
        onSlideEnd={() => (rectRef.current = undefined)}
        onStepKeyDown={(event) => {
          const isBackKey = BACK_KEYS.ltr.includes(event.key);
          onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
        }}
      />
    </SliderOrientationContext.Provider>
  );
}) as SliderVerticalPrimitive;

/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/
type SliderPartOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    onSlideStart(event: React.PointerEvent): void;
    onSlideMove(event: React.PointerEvent): void;
    onSlideEnd(event: React.PointerEvent): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(event: React.KeyboardEvent): void;
  }
>;

type SliderPartPrimitive = Polymorphic.ForwardRefComponent<
  typeof SLIDER_DEFAULT_TAG,
  SliderPartOwnProps
>;

const SliderImpl = React.forwardRef((props, forwardedRef) => {
  const {
    as = SLIDER_DEFAULT_TAG,
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    onHomeKeyDown,
    onEndKeyDown,
    onStepKeyDown,
    ...sliderProps
  } = props;
  const context = useSliderContext(SLIDER_NAME);

  return (
    <Primitive
      {...sliderProps}
      as={as}
      ref={forwardedRef}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === 'Home') {
          onHomeKeyDown(event);
        } else if (event.key === 'End') {
          onEndKeyDown(event);
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
}) as SliderPartPrimitive;

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'SliderTrack';
const TRACK_DEFAULT_TAG = 'span';

type SliderTrackOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type SliderTrackPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRACK_DEFAULT_TAG,
  SliderTrackOwnProps
>;

const SliderTrack = React.forwardRef((props, forwardedRef) => {
  const { as = TRACK_DEFAULT_TAG, ...trackProps } = props;
  const context = useSliderContext(TRACK_NAME);
  return (
    <Primitive
      data-disabled={context.disabled ? '' : undefined}
      data-orientation={context.orientation}
      {...trackProps}
      as={as}
      ref={forwardedRef}
    />
  );
}) as SliderTrackPrimitive;

SliderTrack.displayName = TRACK_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'SliderRange';
const RANGE_DEFAULT_TAG = 'span';

type SliderRangeOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { children?: never }
>;
type SliderRangePrimitive = Polymorphic.ForwardRefComponent<
  typeof RANGE_DEFAULT_TAG,
  SliderRangeOwnProps
>;

const SliderRange = React.forwardRef((props, forwardedRef) => {
  const { as = RANGE_DEFAULT_TAG, ...rangeProps } = props;
  const context = useSliderContext(RANGE_NAME);
  const orientation = React.useContext(SliderOrientationContext);
  const ref = React.useRef<HTMLSpanElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const valuesCount = context.values.length;
  const percentages = context.values.map((value) =>
    convertValueToPercentage(value, context.min, context.max)
  );
  const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
  const offsetEnd = 100 - Math.max(...percentages);

  return (
    <Primitive
      data-orientation={context.orientation}
      data-disabled={context.disabled ? '' : undefined}
      {...rangeProps}
      as={as}
      ref={composedRefs}
      style={{
        ...props.style,
        [orientation.startEdge]: offsetStart + '%',
        [orientation.endEdge]: offsetEnd + '%',
      }}
    />
  );
}) as SliderRangePrimitive;

SliderRange.displayName = RANGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SliderThumb';
const THUMB_DEFAULT_TAG = 'span';

type SliderThumbOwnProps = Omit<Polymorphic.OwnProps<typeof SliderThumbImpl>, 'index'>;
type SliderThumbPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SliderThumbImpl>,
  SliderThumbOwnProps
>;

const SliderThumb = React.forwardRef((props, forwardedRef) => {
  const { getItems } = useCollection();
  const [thumb, setThumb] = React.useState<React.ElementRef<typeof SliderThumbImpl> | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
  const index = React.useMemo(
    () => (thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1),
    [getItems, thumb]
  );
  return <SliderThumbImpl {...props} ref={composedRefs} index={index} />;
}) as SliderThumbPrimitive;

type SliderThumbImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { index: number }
>;

type SliderThumbImplPrimitive = Polymorphic.ForwardRefComponent<
  typeof THUMB_DEFAULT_TAG,
  SliderThumbImplOwnProps
>;

const SliderThumbImpl = React.forwardRef((props, forwardedRef) => {
  const { as = THUMB_DEFAULT_TAG, index, ...thumbProps } = props;
  const context = useSliderContext(THUMB_NAME);
  const orientation = React.useContext(SliderOrientationContext);
  const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
  const size = useSize(thumb);
  // We cast because index could be `-1` which would return undefined
  const value = context.values[index] as number | undefined;
  const percent = value ? convertValueToPercentage(value, context.min, context.max) : 0;
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
      <CollectionItemSlot>
        <Primitive
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
          as={as}
          ref={composedRefs}
          /**
           * There will be no value on initial render while we work out the index so we hide thumbs
           * without a value, otherwise SSR will render them in the wrong position before they
           * snap into the correct position during hydration which would be visually jarring for
           * slower connections.
           */
          style={value ? props.style : { display: 'none' }}
          onFocus={composeEventHandlers(props.onFocus, () => {
            context.valueIndexToChangeRef.current = index;
          })}
        />
      </CollectionItemSlot>
    </span>
  );
}) as SliderThumbImplPrimitive;

SliderThumb.displayName = THUMB_NAME;

/* -----------------------------------------------------------------------------------------------*/

const BubbleInput = (props: React.ComponentProps<'input'>) => {
  const { value, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevValue = usePrevious(value);

  // Bubble value change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
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
   * to be set programatically and bubble to any parent form `onChange` event.
   * Adding the `value` will cause React to consider the programatic
   * dispatch a duplicate and it will get swallowed.
   */
  return <input style={{ display: 'none' }} {...inputProps} ref={ref} defaultValue={value} />;
};

function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  return percentPerStep * (value - min);
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
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
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
export type { SliderPrimitive, SliderTrackPrimitive, SliderRangePrimitive, SliderThumbPrimitive };
