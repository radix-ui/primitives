import * as React from 'react';
import omit from 'lodash.omit';
import { cssReset, clamp, interopDataAttr } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  useComposedRefs,
  useControlledState,
  useCallbackRef,
} from '@interop-ui/react-utils';
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

type SliderDOMProps = Omit<SliderPartDOMProps, 'defaultValue' | 'onChange' | 'dir'>;
type SliderControlledProps = { value: number; onChange?(value: number): void };
type SliderUncontrolledProps = { defaultValue: number; onChange?(value: number): void };
type SliderRangeControlledProps = { value: number[]; onChange?(value: number[]): void };
type SliderRangeUncontrolledProps = {
  defaultValue: number[];
  onChange?: (value: number[]) => void;
};
type SliderOwnProps = {
  name?: string;
  disabled?: boolean;
  orientation?: SliderDOMProps['aria-orientation'];
  dir?: Direction;
  min?: number;
  max?: number;
  step?: number;
} & (
  | SliderControlledProps
  | SliderUncontrolledProps
  | SliderRangeControlledProps
  | SliderRangeUncontrolledProps
);
type SliderProps = SliderDOMProps & SliderOwnProps;

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

const Slider = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderProps, SliderStaticProps>(
  function Slider(props, forwardedRef) {
    const {
      children,
      name,
      min = 0,
      max = 100,
      step: stepProp = 1,
      orientation = 'horizontal',
      disabled = false,
      onChange = () => {},
      ...restProps
    } = props;

    const { defaultValue } = props as SliderUncontrolledProps | SliderRangeUncontrolledProps;
    const { value } = props as SliderControlledProps | SliderRangeControlledProps;
    const step = Math.max(stepProp, 1);
    const sliderProps = omit(restProps, ['defaultValue', 'value']) as SliderDOMProps;
    const sliderRef = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, sliderRef);
    const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set());
    const valueIndexToChangeRef = React.useRef<number>(0);
    const isHorizontal = orientation === 'horizontal';
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;

    const [values = [], setValues] = useControlledState({
      prop: value === undefined ? undefined : toArray(value),
      defaultProp: defaultValue === undefined ? undefined : toArray(defaultValue),
      onChange: (values) => {
        if (Array.isArray(value || defaultValue)) {
          const onRangeChange = onChange as SliderRangeControlledProps['onChange'];
          onRangeChange?.(values);
        } else {
          const onValueChange = onChange as SliderControlledProps['onChange'];
          onValueChange?.(values[0]);
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
          const prevValue = prevValues[atIndex];
          const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          resolve(valueIndexToChangeRef.current);
          return nextValues[atIndex] !== prevValue ? nextValues : prevValues;
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
        {...interopDataAttrObj('root')}
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

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

const SliderOrientationContext = React.createContext<{
  startEdge: 'bottom' | 'left';
  endEdge: 'top' | 'right';
  size: keyof NonNullable<ReturnType<typeof useSize>>;
}>({} as any);

type SliderOrientationProps = SliderPartDOMProps & {
  min: number;
  max: number;
  onSlideStart?(value: number): void;
  onSlideMove?(value: number): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void;
};

type SliderHorizontalProps = SliderOrientationProps & {
  dir?: Direction;
};

const SliderHorizontal = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderHorizontalProps>(
  function SliderHorizontal(props, forwardedRef) {
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
          ['--thumb-transform' as any]: 'translateX(-50%)',
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

type SliderVerticalProps = SliderOrientationProps;

const SliderVertical = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderVerticalProps>(
  function SliderVertical(props, forwardedRef) {
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
          ['--thumb-transform' as any]: 'translateY(50%)',
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

type SliderPartDOMProps = React.ComponentPropsWithoutRef<typeof SLIDER_DEFAULT_TAG>;
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
type SliderPartProps = SliderPartDOMProps & SliderPartOwnProps;

const SliderPart = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderPartProps>(function SliderPart(
  props,
  forwardedRef
) {
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
});

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'Slider.Track';
const TRACK_DEFAULT_TAG = 'span';

type SliderTrackDOMProps = React.ComponentPropsWithoutRef<typeof TRACK_DEFAULT_TAG>;
type SliderTrackOwnProps = {};
type SliderTrackProps = SliderTrackDOMProps & SliderTrackOwnProps;

const SliderTrack = forwardRef<typeof TRACK_DEFAULT_TAG, SliderTrackProps>(function SliderTrack(
  props,
  forwardedRef
) {
  const { as: Comp = TRACK_DEFAULT_TAG, children, ...trackProps } = props;
  return (
    <Comp {...interopDataAttrObj('track')} {...trackProps} ref={forwardedRef}>
      {children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'Slider.Range';
const RANGE_DEFAULT_TAG = 'span';

type SliderRangeProps = Omit<React.ComponentPropsWithoutRef<typeof RANGE_DEFAULT_TAG>, 'children'>;

const SliderRange = forwardRef<typeof RANGE_DEFAULT_TAG, SliderRangeProps>(function SliderRange(
  props,
  forwardedRef
) {
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
      {...interopDataAttrObj('range')}
      {...rangeProps}
      ref={composedRefs}
      style={{
        ...style,
        [orientation.startEdge]: offsetStart + '%',
        [orientation.endEdge]: offsetEnd + '%',
      }}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'Slider.Thumb';
const THUMB_DEFAULT_TAG = 'span';

type SliderThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type SliderThumbOwnProps = {};
type SliderThumbProps = SliderThumbDOMProps & SliderThumbOwnProps;
type SliderThumbImplProps = SliderThumbProps & { value: number; index: number };

const SliderThumb = forwardRef<typeof THUMB_DEFAULT_TAG, SliderThumbProps>(function SliderThumb(
  props,
  forwardedRef
) {
  const { ref: collectionRef, index } = useSliderCollectionItem();
  const ref = useComposedRefs(forwardedRef, collectionRef);
  const context = useSliderContext(THUMB_NAME);
  const value = context.values[index];
  return value !== undefined ? (
    <SliderThumbImpl {...props} ref={ref} index={index} value={value} />
  ) : null;
});

const SliderThumbImpl = forwardRef<typeof THUMB_DEFAULT_TAG, SliderThumbImplProps>(
  function SliderThumbImpl(props, forwardedRef) {
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
          transform: 'var(--thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}
      >
        <Comp
          {...thumbProps}
          {...interopDataAttrObj('thumb')}
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
        />
      </span>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

Slider.Track = SliderTrack;
Slider.Range = SliderRange;
Slider.Thumb = SliderThumb;

Slider.displayName = SLIDER_NAME;
Slider.Track.displayName = TRACK_NAME;
Slider.Range.displayName = RANGE_NAME;
Slider.Thumb.displayName = THUMB_NAME;

interface SliderStaticProps {
  Track: typeof SliderTrack;
  Range: typeof SliderRange;
  Thumb: typeof SliderThumb;
}

const [styles, interopDataAttrObj] = createStyleObj(SLIDER_NAME, {
  root: {
    ...cssReset(SLIDER_DEFAULT_TAG),
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    userSelect: 'none',
    touchAction: 'none', // Disable browser handling of all panning and zooming gestures on touch devices
  },
  track: {
    ...cssReset(TRACK_DEFAULT_TAG),
    position: 'relative',
    flexGrow: 1,
  },
  range: {
    ...cssReset(RANGE_DEFAULT_TAG),
    position: 'absolute',
  },
  thumb: {
    ...cssReset(THUMB_DEFAULT_TAG),
    display: 'block',
    outline: 'none',

    // Add recommended target size regardless of styled size
    '&::before': {
      content: '""',
      position: 'absolute',
      zIndex: -1,
      width: 44,
      height: 44,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
});

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
  const thumbAttributeName = interopDataAttr(THUMB_NAME);
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

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(domain: [number, number], range: [number, number]) {
  return (value: number) => {
    if (domain[0] === domain[1] || range[0] === range[1]) return range[0];
    const ratio = (range[1] - range[0]) / (domain[1] - domain[0]);
    return range[0] + ratio * (value - domain[0]);
  };
}

export type { SliderProps, SliderRangeProps, SliderTrackProps, SliderThumbProps };
export { Slider, styles };
