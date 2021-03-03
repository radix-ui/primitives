import * as React from 'react';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useSize } from '@radix-ui/react-use-size';
import { useComposedRefs } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { createCollection } from '@radix-ui/react-collection';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type Direction = 'ltr' | 'rtl';

const PAGE_KEYS = ['PageUp', 'PageDown'];
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const BACK_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowDown', 'Home', 'ArrowLeft', 'PageUp'],
  rtl: ['ArrowDown', 'Home', 'ArrowRight', 'PageDown'],
};

const [createSliderCollection, useSliderCollectionItem] = createCollection('Slider');
const SliderCollectionProvider = createSliderCollection((props: { children: React.ReactNode }) => (
  <>{props.children}</>
));

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
  const sliderRef = React.useRef<HTMLSpanElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, sliderRef);
  const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set());
  const valueIndexToChangeRef = React.useRef<number>(0);
  const isHorizontal = orientation === 'horizontal';
  const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;

  const [values = [], setValues] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  function handleSlideStart(value: number) {
    const closestIndex = getClosestValueIndex(values, value);
    updateValues(value, closestIndex).then((valueIndexToChange) => {
      /**
       * Browsers fire event handlers before executing their event implementation
       * so they can check if `preventDefault` was called first. Therefore,
       * if we focus the thumb on slide start (`mousedown`), the browser will execute
       * their `mousedown` implementation after our focus which will instantly
       * `blur` the thumb again (because it effectively clicks off the thumb).
       *
       * We use a `setTimeout`  to move the focus to the next tick (after the
       * mousedown) to ensure focus on mousedown.
       */
      window.setTimeout(() => focusThumb(valueIndexToChange), 0);
    });
  }

  function handleSlideMove(value: number) {
    updateValues(value, valueIndexToChangeRef.current).then(focusThumb);
  }

  function updateValues(value: number, atIndex: number): Promise<number> {
    const decimalCount = getDecimalCount(step);
    const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
    const nextValue = clamp(snapToStep, [min, max]);

    return new Promise((resolve) => {
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);

        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          resolve(valueIndexToChangeRef.current);
          return nextValues[atIndex] !== prevValues[atIndex] ? nextValues : prevValues;
        } else {
          resolve(valueIndexToChangeRef.current);
          return prevValues;
        }
      });
    });
  }

  function focusThumb(index: number) {
    const thumbs = [...thumbRefs.current];
    thumbs[index]?.focus();
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
      <SliderCollectionProvider>
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

        {/**
         * When consumer provides `name`, they are most likely uncontrolling so
         * we render `input`s that will bubble the value change.
         */}
        {name &&
          values.map((value, index) => (
            <BubbleInput
              key={index}
              name={name + (values.length > 1 ? '[]' : '')}
              value={value}
              hidden
            />
          ))}
      </SliderCollectionProvider>
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
  Polymorphic.OwnProps<typeof SliderPart>,
  | 'onSlideMouseDown'
  | 'onSlideMouseMove'
  | 'onSlideMouseUp'
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
  Polymorphic.IntrinsicElement<typeof SliderPart>,
  SliderHorizontalOwnProps
>;

const SliderHorizontal = React.forwardRef((props, forwardedRef) => {
  const { min, max, dir, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props;
  const sliderRef = React.useRef<React.ElementRef<typeof SliderPart>>(null);
  const ref = useComposedRefs(forwardedRef, sliderRef);
  const rectRef = React.useRef<ClientRect>();
  const direction = useDirection({ ref: sliderRef, directionProp: dir });
  const isDirectionLTR = direction === 'ltr';

  function getValueFromPointer(pointerPosition: number) {
    const rect = rectRef.current || sliderRef.current!.getBoundingClientRect();
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
      <SliderPart
        data-orientation="horizontal"
        {...sliderProps}
        ref={ref}
        style={{
          ...sliderProps.style,
          ['--radix-slider-thumb-transform' as any]: 'translateX(-50%)',
        }}
        onSlideMouseDown={(event) => {
          const value = getValueFromPointer(event.clientX);
          onSlideStart?.(value);
        }}
        onSlideMouseMove={(event) => {
          const value = getValueFromPointer(event.clientX);
          onSlideMove?.(value);
        }}
        onSlideMouseUp={() => (rectRef.current = undefined)}
        onSlideTouchStart={(event) => {
          const touch = event.targetTouches[0];
          const value = getValueFromPointer(touch.clientX);
          onSlideStart?.(value);
        }}
        onSlideTouchMove={(event) => {
          const touch = event.targetTouches[0];
          const value = getValueFromPointer(touch.clientX);
          onSlideMove?.(value);
        }}
        onSlideTouchEnd={() => (rectRef.current = undefined)}
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
  Polymorphic.IntrinsicElement<typeof SliderPart>,
  SliderVerticalOwnProps
>;

const SliderVertical = React.forwardRef((props, forwardedRef) => {
  const { min, max, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props;
  const sliderRef = React.useRef<React.ElementRef<typeof SliderPart>>(null);
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
      <SliderPart
        data-orientation="vertical"
        {...sliderProps}
        ref={ref}
        style={{
          ...sliderProps.style,
          ['--radix-slider-thumb-transform' as any]: 'translateY(50%)',
        }}
        onSlideMouseDown={(event) => {
          const value = getValueFromPointer(event.clientY);
          onSlideStart?.(value);
        }}
        onSlideMouseMove={(event) => {
          const value = getValueFromPointer(event.clientY);
          onSlideMove?.(value);
        }}
        onSlideMouseUp={() => (rectRef.current = undefined)}
        onSlideTouchStart={(event) => {
          const touch = event.targetTouches[0];
          const value = getValueFromPointer(touch.clientY);
          onSlideStart?.(value);
        }}
        onSlideTouchMove={(event) => {
          const touch = event.targetTouches[0];
          const value = getValueFromPointer(touch.clientY);
          onSlideMove?.(value);
        }}
        onSlideTouchEnd={() => (rectRef.current = undefined)}
        onStepKeyDown={(event) => {
          const isBackKey = BACK_KEYS.ltr.includes(event.key);
          onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
        }}
      />
    </SliderOrientationContext.Provider>
  );
}) as SliderVerticalPrimitive;

/* -------------------------------------------------------------------------------------------------
 * SliderPart
 * -----------------------------------------------------------------------------------------------*/
type SliderPartOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    onSlideMouseDown(event: React.MouseEvent): void;
    onSlideMouseMove(event: MouseEvent): void;
    onSlideMouseUp(): void;
    onSlideTouchStart(event: React.TouchEvent): void;
    onSlideTouchMove(event: TouchEvent): void;
    onSlideTouchEnd(): void;
    onHomeKeyDown(event: React.KeyboardEvent): void;
    onEndKeyDown(event: React.KeyboardEvent): void;
    onStepKeyDown(event: React.KeyboardEvent): void;
  }
>;

type SliderPartPrimitive = Polymorphic.ForwardRefComponent<
  typeof SLIDER_DEFAULT_TAG,
  SliderPartOwnProps
>;

const SliderPart = React.forwardRef((props, forwardedRef) => {
  const {
    as = SLIDER_DEFAULT_TAG,
    onSlideMouseDown,
    onSlideMouseMove,
    onSlideMouseUp,
    onSlideTouchStart,
    onSlideTouchMove,
    onSlideTouchEnd,
    onHomeKeyDown,
    onEndKeyDown,
    onStepKeyDown,
    ...sliderProps
  } = props;

  const handleSlideMouseMove = useCallbackRef(onSlideMouseMove);
  const handleSlideTouchMove = useCallbackRef(onSlideTouchMove);
  const removeMouseEventListeners = useCallbackRef(() => {
    document.removeEventListener('mousemove', handleSlideMouseMove);
    document.removeEventListener('mouseup', removeMouseEventListeners);
    onSlideMouseUp();
  });
  const removeTouchEventListeners = useCallbackRef(() => {
    document.removeEventListener('touchmove', handleSlideTouchMove);
    document.removeEventListener('touchend', removeTouchEventListeners);
    onSlideTouchEnd();
  });

  React.useEffect(() => {
    return () => {
      removeMouseEventListeners();
      removeTouchEventListeners();
    };
  }, [removeMouseEventListeners, removeTouchEventListeners]);

  return (
    <Primitive
      {...sliderProps}
      as={as}
      ref={forwardedRef}
      onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
        // Slide only if main mouse button was clicked
        if (event.button === 0) {
          if (!isThumb(event.target)) onSlideMouseDown(event);
          document.addEventListener('mousemove', handleSlideMouseMove);
          document.addEventListener('mouseup', removeMouseEventListeners);
        }
        // We purpoesfully avoid calling `event.preventDefault` here as it will
        // also prevent PointerEvents which we need.
      })}
      onTouchStart={composeEventHandlers(props.onTouchStart, (event) => {
        if (isThumb(event.target)) {
          // Touch devices have a delay before focusing and won't focus if touch
          // immediatedly moves away from target. We want thumb to focus regardless.
          event.target.focus();
        } else {
          onSlideTouchStart(event);
        }

        document.addEventListener('touchmove', handleSlideTouchMove);
        document.addEventListener('touchend', removeTouchEventListeners);
        // Prevent scrolling for touch events
        event.preventDefault();
      })}
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
      /**
       * Prevent pointer events on other elements on the page while sliding.
       * For example, stops hover states from triggering on buttons if
       * mouse moves over a button during slide.
       *
       * Also ensures that slider receives all pointer events after mouse down
       * even when mouse moves outside the document.
       */
      onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
      })}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
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

type SliderThumbOwnProps = Omit<Polymorphic.OwnProps<typeof SliderThumbImpl>, 'value' | 'index'>;
type SliderThumbPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof SliderThumbImpl>,
  SliderThumbOwnProps
>;

const SliderThumb = React.forwardRef((props, forwardedRef) => {
  const { ref: collectionRef, index } = useSliderCollectionItem();
  const ref = useComposedRefs(forwardedRef, collectionRef);
  const context = useSliderContext(THUMB_NAME);
  const value = context.values[index];
  return value !== undefined ? (
    <SliderThumbImpl {...props} ref={ref} index={index} value={value} />
  ) : null;
}) as SliderThumbPrimitive;

type SliderThumbImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    value: number;
    index: number;
  }
>;

type SliderThumbImplPrimitive = Polymorphic.ForwardRefComponent<
  typeof THUMB_DEFAULT_TAG,
  SliderThumbImplOwnProps
>;

const SliderThumbImpl = React.forwardRef((props, forwardedRef) => {
  const { as = THUMB_DEFAULT_TAG, index, value, ...thumbProps } = props;
  const context = useSliderContext(THUMB_NAME);
  const orientation = React.useContext(SliderOrientationContext);
  const thumbRef = React.useRef<HTMLSpanElement>(null);
  const ref = useComposedRefs(forwardedRef, thumbRef);
  const size = useSize(thumbRef);
  const percent = convertValueToPercentage(value, context.min, context.max);
  const label = getLabel(index, context.values.length);
  const orientationSize = size?.[orientation.size];
  const thumbInBoundsOffset = orientationSize
    ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction)
    : 0;

  React.useEffect(() => {
    const thumb = thumbRef.current;
    if (thumb) {
      context.thumbs.add(thumb);
      return () => {
        context.thumbs.delete(thumb);
      };
    }
  }, [context.thumbs]);

  return (
    <span
      style={{
        transform: 'var(--radix-slider-thumb-transform)',
        position: 'absolute',
        [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
      }}
    >
      <Primitive
        data-radix-slider-thumb=""
        aria-label={props['aria-label'] || label}
        aria-valuemin={context.min}
        aria-valuenow={value}
        aria-valuemax={context.max}
        aria-orientation={context.orientation}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? '' : undefined}
        role="slider"
        {...thumbProps}
        as={as}
        ref={ref}
        tabIndex={0}
        onFocus={composeEventHandlers(props.onFocus, () => {
          context.valueIndexToChangeRef.current = index;
        })}
      />
    </span>
  );
}) as SliderThumbImplPrimitive;

SliderThumb.displayName = THUMB_NAME;

/* -----------------------------------------------------------------------------------------------*/

const BubbleInput = (props: React.ComponentProps<'input'>) => {
  const { value, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);

  // Bubble value change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const { set } = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor;

    if (set) {
      const event = new Event('input', { bubbles: true });
      set.call(input, value);
      input.dispatchEvent(event);
    }
  }, [value]);

  /**
   * We purposefully do not use `type="hidden"` here otherwise forms that
   * wrap it will not be able to access its value via the FormData API.
   *
   * We purposefully do not add the `value` attribute here to allow the value
   * to be set programatically and bubble to any parent form `onChange` event.
   * Adding the `value` will cause React to consider the programatic
   * dispatch a duplicate and it will get swallowed.
   */
  return <input hidden {...inputProps} ref={ref} />;
};

function useDirection({
  ref,
  directionProp,
}: {
  ref: React.RefObject<any>;
  directionProp?: Direction;
}) {
  const [direction, setDirection] = React.useState<Direction>('ltr');
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const rAFRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (directionProp === undefined) {
      const computedStyle = getComputedStyle(ref.current);
      setComputedStyle(computedStyle);
    }
  }, [directionProp, ref]);

  React.useEffect(() => {
    function getDirection() {
      rAFRef.current = requestAnimationFrame(() => {
        const dir = computedStyle?.direction as Direction | '' | undefined;
        if (dir) setDirection(dir);
        getDirection();
      });
    }

    if (directionProp === undefined) getDirection();
    return () => cancelAnimationFrame(rAFRef.current);
  }, [computedStyle, directionProp, setDirection]);

  return directionProp || direction;
}

function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}

function isThumb(node: any): node is HTMLElement {
  const thumbAttributeName = 'data-radix-slider-thumb';
  const thumbAttribute = node.getAttribute(thumbAttributeName);
  // `getAttribute` returns the attribute value and since we add the
  // attribute without a value, we must check it is an empty string
  // to determine its existence
  return thumbAttribute === '';
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
function linearScale(domain: [number, number], range: [number, number]) {
  return (value: number) => {
    if (domain[0] === domain[1] || range[0] === range[1]) return range[0];
    const ratio = (range[1] - range[0]) / (domain[1] - domain[0]);
    return range[0] + ratio * (value - domain[0]);
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
