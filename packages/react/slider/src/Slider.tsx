import * as React from 'react';
import { clamp, getPartDataAttr, getPartDataAttrObj } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  useComposedRefs,
  useControlledState,
  useCallbackRef,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { createCollection } from '@interop-ui/react-collection';
import { useSize } from '@interop-ui/react-use-size';

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
  min: number;
  max: number;
  values: number[];
  valueIndexToChangeRef: React.MutableRefObject<number>;
  thumbs: Set<React.ElementRef<typeof SliderThumb>>;
  orientation: SliderOwnProps['orientation'];
};

const [SliderContext, useSliderContext] = createContext<SliderContextValue>(
  'SliderContext',
  SLIDER_NAME
);

type SliderSingleThumbProps = {
  value?: number;
  defaultValue?: number;
};

type SliderMultiThumbProps = {
  minStepsBetweenThumbs?: number;
  value?: number[];
  defaultValue?: number[];
};

type SliderOwnProps = {
  name?: string;
  disabled?: boolean;
  orientation?: React.AriaAttributes['aria-orientation'];
  dir?: Direction;
  min?: number;
  max?: number;
  step?: number;
  onChange?(value: number | number[]): void;
} & (SliderSingleThumbProps | SliderMultiThumbProps);

const Slider = forwardRefWithAs<typeof SLIDER_DEFAULT_TAG, SliderOwnProps>(
  (props, forwardedRef) => {
    const {
      children,
      name,
      min = 0,
      max = 100,
      step: stepProp = 1,
      orientation = 'horizontal',
      disabled = false,
      defaultValue,
      value,
      onChange = () => {},
      ...restProps
    } = props;

    const step = Math.max(stepProp, 1);
    const sliderRef = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, sliderRef);
    const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set());
    const valueIndexToChangeRef = React.useRef<number>(0);
    const isHorizontal = orientation === 'horizontal';
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;

    const { minStepsBetweenThumbs = 0 } = restProps as SliderMultiThumbProps;
    const sliderProps = restProps as SliderSingleThumbProps;
    // @ts-ignore
    delete sliderProps.minStepsBetweenThumbs;

    const [values = [], setValues] = useControlledState({
      prop: value === undefined ? undefined : toArray(value),
      defaultProp: defaultValue === undefined ? undefined : toArray(defaultValue),
      onChange: (values) => {
        if (Array.isArray(value || defaultValue)) {
          onChange(values);
        } else {
          onChange(values[0]);
        }
      },
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
      const snapToStep = Math.round((value - min) / step) * step + min;
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
      <SliderOrientation
        {...sliderProps}
        {...getPartDataAttrObj(SLIDER_NAME)}
        ref={composedRefs}
        min={min}
        max={max}
        aria-disabled={disabled}
        data-disabled={disabled}
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
      >
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

        <SliderContext.Provider
          value={React.useMemo(
            () => ({
              min,
              max,
              valueIndexToChangeRef,
              thumbs: thumbRefs.current,
              values,
              orientation,
            }),
            [min, max, values, orientation]
          )}
        >
          <SliderCollectionProvider>{children}</SliderCollectionProvider>
        </SliderContext.Provider>
      </SliderOrientation>
    );
  }
);

Slider.displayName = SLIDER_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

const SliderOrientationContext = React.createContext<{
  startEdge: 'bottom' | 'left';
  endEdge: 'top' | 'right';
  size: keyof NonNullable<ReturnType<typeof useSize>>;
}>({} as any);

type SliderOrientationOwnProps = {
  min: number;
  max: number;
  onSlideStart?(value: number): void;
  onSlideMove?(value: number): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void;
  onSlideMouseDown?: never;
  onSlideMouseMove?: never;
  onSlideMouseUp?: never;
  onSlideTouchStart?: never;
  onSlideTouchMove?: never;
  onSlideTouchEnd?: never;
};

type SliderHorizontalOwnProps = SliderOrientationOwnProps & {
  dir?: Direction;
};

const SliderHorizontal = forwardRefWithAs<typeof SliderPart, SliderHorizontalOwnProps>(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      children,
      onSlideStart,
      onSlideMove,
      onStepKeyDown,
      ...sliderProps
    } = props;
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
      <SliderPart
        {...sliderProps}
        ref={ref}
        style={{
          ...sliderProps.style,
          ['--interop-ui-slider-thumb-transform' as any]: 'translateX(-50%)',
        }}
        data-orientation="horizontal"
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
      >
        <SliderOrientationContext.Provider
          value={React.useMemo(() => ({ startEdge: 'left', endEdge: 'right', size: 'width' }), [])}
        >
          {isDirectionLTR ? (
            children
          ) : (
            <span
              style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                transform: 'rotate(180deg)',
              }}
            >
              {children}
            </span>
          )}
        </SliderOrientationContext.Provider>
      </SliderPart>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderVertical
 * -----------------------------------------------------------------------------------------------*/

const SliderVertical = forwardRefWithAs<typeof SliderPart, SliderOrientationOwnProps>(
  (props, forwardedRef) => {
    const { min, max, children, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props;
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
      <SliderPart
        {...sliderProps}
        ref={ref}
        style={{
          ...sliderProps.style,
          ['--interop-ui-slider-thumb-transform' as any]: 'translateY(50%)',
        }}
        data-orientation="vertical"
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
      >
        <SliderOrientationContext.Provider
          value={React.useMemo(() => ({ startEdge: 'bottom', endEdge: 'top', size: 'height' }), [])}
        >
          {children}
        </SliderOrientationContext.Provider>
      </SliderPart>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderPart
 * -----------------------------------------------------------------------------------------------*/
type SliderPartOwnProps = {
  onSlideMouseDown(event: React.MouseEvent): void;
  onSlideMouseMove(event: MouseEvent): void;
  onSlideMouseUp(): void;
  onSlideTouchStart(event: React.TouchEvent): void;
  onSlideTouchMove(event: TouchEvent): void;
  onSlideTouchEnd(): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(event: React.KeyboardEvent): void;
};

const SliderPart = forwardRefWithAs<typeof SLIDER_DEFAULT_TAG, SliderPartOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = SLIDER_DEFAULT_TAG,
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
      <Comp
        {...sliderProps}
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
          event.currentTarget.setPointerCapture(event.pointerId);
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
        })}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'SliderTrack';
const TRACK_DEFAULT_TAG = 'span';

const SliderTrack = forwardRefWithAs<typeof TRACK_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TRACK_DEFAULT_TAG, children, ...trackProps } = props;
  const context = useSliderContext(TRACK_NAME);
  return (
    <Comp
      {...getPartDataAttrObj(TRACK_NAME)}
      {...trackProps}
      ref={forwardedRef}
      data-orientation={context.orientation}
    >
      {children}
    </Comp>
  );
});

SliderTrack.displayName = TRACK_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'SliderRange';
const RANGE_DEFAULT_TAG = 'span';

type SliderRangeOwnProps = {
  children?: never;
};

const SliderRange = forwardRefWithAs<typeof RANGE_DEFAULT_TAG, SliderRangeOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = RANGE_DEFAULT_TAG, style, ...rangeProps } = props;
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
      <Comp
        {...getPartDataAttrObj(RANGE_NAME)}
        {...rangeProps}
        ref={composedRefs}
        style={{
          ...style,
          [orientation.startEdge]: offsetStart + '%',
          [orientation.endEdge]: offsetEnd + '%',
        }}
        data-orientation={context.orientation}
      />
    );
  }
);

SliderRange.displayName = RANGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SliderThumb';
const THUMB_DEFAULT_TAG = 'span';

type SliderThumbOwnProps = { value?: never; index?: never };

const SliderThumb = forwardRefWithAs<typeof SliderThumbImpl, SliderThumbOwnProps>(
  (props, forwardedRef) => {
    const { ref: collectionRef, index } = useSliderCollectionItem();
    const ref = useComposedRefs(forwardedRef, collectionRef);
    const context = useSliderContext(THUMB_NAME);
    const value = context.values[index];
    return value !== undefined ? (
      <SliderThumbImpl {...props} ref={ref} index={index} value={value} />
    ) : null;
  }
);

type SliderThumbImplOwnProps = { value: number; index: number };

const SliderThumbImpl = forwardRefWithAs<typeof THUMB_DEFAULT_TAG, SliderThumbImplOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = THUMB_DEFAULT_TAG, index, value, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME);
    const orientation = React.useContext(SliderOrientationContext);
    const thumbRef = React.useRef<HTMLSpanElement>(null);
    const ref = useComposedRefs(forwardedRef, thumbRef);
    const size = useSize(thumbRef);
    const percent = convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size?.[orientation.size];
    const thumbInBoundsOffset = orientationSize
      ? getThumbInBoundsOffset(orientationSize, percent)
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
          transform: 'var(--interop-ui-slider-thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}
      >
        <Comp
          {...thumbProps}
          {...getPartDataAttrObj(THUMB_NAME)}
          ref={ref}
          aria-label={props['aria-label'] || label}
          aria-valuemin={context.min}
          aria-valuenow={value}
          aria-valuemax={context.max}
          aria-orientation={context.orientation}
          role="slider"
          tabIndex={0}
          onFocus={composeEventHandlers(props.onFocus, () => {
            context.valueIndexToChangeRef.current = index;
          })}
          data-orientation={context.orientation}
        />
      </span>
    );
  }
);

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

function toArray(value: number | number[]): number[] {
  return Array.isArray(value) ? value : [value];
}

function isThumb(node: any): node is HTMLElement {
  const thumbAttributeName = getPartDataAttr(THUMB_NAME);
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
function getThumbInBoundsOffset(width: number, left: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return halfWidth - offset(left);
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

export { Slider, SliderTrack, SliderRange, SliderThumb };
