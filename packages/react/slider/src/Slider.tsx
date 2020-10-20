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
  useRect,
} from '@interop-ui/react-utils';
import { createCollection } from '@interop-ui/react-collection';
import { useSize } from '@interop-ui/react-use-size';

const [createSliderCollection, useSliderCollectionItem] = createCollection('Slider');
const SliderCollectionProvider = createSliderCollection((props: { children: React.ReactNode }) => (
  <>{props.children}</>
));

const PAGE_KEYS = ['PageUp', 'PageDown'];
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const BACK_KEYS = ['ArrowUp', 'ArrowLeft', 'Home', 'PageUp'];
const SLIDER_KEYS = [
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
];

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

const SLIDER_NAME = 'Slider';
const SLIDER_DEFAULT_TAG = 'span';

type SliderBoundsProps = { min?: number; max?: number; step?: number };
type SliderDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof SLIDER_DEFAULT_TAG>,
  'defaultValue' | 'onChange'
>;
type SliderControlledProps = { value: number; onChange?: (value: number) => void };
type SliderUncontrolledProps = { defaultValue: number; onChange?: (value: number) => void };
type SliderRangeControlledProps = { value: number[]; onChange?: (value: number[]) => void };
type SliderRangeUncontrolledProps = {
  defaultValue: number[];
  onChange?: (value: number[]) => void;
};
type SliderOwnProps = {
  name?: string;
  disabled?: boolean;
  orientation?: SliderDOMProps['aria-orientation'];
} & SliderBoundsProps &
  (
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
  activeValueIndexRef: React.MutableRefObject<number>;
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
    const sliderBounds = { min, max, step };
    const sliderProps = omit(restProps, ['defaultValue', 'value']) as SliderDOMProps;
    const sliderRef = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, sliderRef);
    const activeValueIndexRef = React.useRef<number>(0);
    const SliderOrientation = orientation === 'horizontal' ? SliderHorizontal : SliderVertical;

    const [values = [], setValues] = useControlledState({
      prop: value === undefined ? undefined : toArray(value),
      defaultProp: defaultValue === undefined ? undefined : toArray(defaultValue),
      onChange: (values) => {
        if (Array.isArray(value)) {
          const onRangeChange = onChange as SliderRangeControlledProps['onChange'];
          onRangeChange?.(values);
        } else {
          const onValueChange = onChange as SliderControlledProps['onChange'];
          onValueChange?.(values[0]);
        }
      },
    });

    function handleSlideStart(pointerPosition: number, sliderSize: number, sliderOffset: number) {
      const value = getValueFromPointer(pointerPosition, sliderSize, sliderOffset, sliderBounds);
      const closestIndex = getClosestValueIndex(values, value);
      updateValues(value, closestIndex);
    }

    function handleSlideMove(pointerPosition: number, sliderSize: number, sliderOffset: number) {
      const value = getValueFromPointer(pointerPosition, sliderSize, sliderOffset, sliderBounds);
      updateValues(value, activeValueIndexRef.current);
    }

    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      if (SLIDER_KEYS.includes(event.key)) {
        if (event.key === 'Home') {
          updateValues(min, 0);
        } else if (event.key === 'End') {
          updateValues(max, values.length - 1);
        } else {
          const isBackKey = BACK_KEYS.includes(event.key);
          const isPageKey = PAGE_KEYS.includes(event.key);
          const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
          const direction = isBackKey ? -1 : 1;
          const multiplier = isSkipKey ? 10 : 1;
          const atIndex = activeValueIndexRef.current;
          const value = values[atIndex];
          const stepInDirection = step * multiplier * direction;
          updateValues(value + stepInDirection, atIndex);
        }
        // Prevent scrolling for key events
        event.preventDefault();
      }
    });

    function updateValues(value: number, atIndex: number) {
      const snappedValue = getSnappedValue(value, sliderBounds);

      setValues((prevValues = []) => {
        const nextValues = sort(getUpdatedValues(atIndex, prevValues, snappedValue));
        const activeIndex = nextValues.indexOf(snappedValue);
        activeValueIndexRef.current = activeIndex;
        return nextValues;
      });
    }

    return (
      <SliderOrientation
        {...sliderProps}
        {...interopDataAttrObj('root')}
        ref={composedRefs}
        onSlideStart={disabled ? undefined : handleSlideStart}
        onSlideMove={disabled ? undefined : handleSlideMove}
        onKeyDown={disabled ? undefined : handleKeyDown}
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
              activeValueIndexRef,
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
 * SliderHorizontal / SliderVertical
 * -----------------------------------------------------------------------------------------------*/

const SliderOrientationContext = React.createContext<{
  startEdge: 'top' | 'left';
  endEdge: 'bottom' | 'right';
  size: keyof NonNullable<ReturnType<typeof useSize>>;
}>({} as any);

type SliderOrientationProps = SliderPartDOMProps & {
  onSlideStart?: (pointerPosition: number, sliderSize: number, sliderOffset: number) => void;
  onSlideMove?: (pointerPosition: number, sliderSize: number, sliderOffset: number) => void;
};

const SliderHorizontal = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderOrientationProps>(
  function SliderHorizontal(props, forwardedRef) {
    const { onSlideStart, onSlideMove, children, ...sliderProps } = props;
    const sliderRef = React.useRef<React.ElementRef<typeof SliderPart>>(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rect = useRect(sliderRef);

    function handleSlideStart(pointerPosition: number) {
      if (rect) onSlideStart?.(pointerPosition, rect.width, rect.left);
    }

    function handleSlideMove(pointerPosition: number) {
      if (rect) onSlideMove?.(pointerPosition, rect.width, rect.left);
    }

    return (
      <SliderPart
        {...sliderProps}
        ref={ref}
        onSlideMouseDown={(event) => handleSlideStart(event.clientX)}
        onSlideMouseMove={(event) => handleSlideMove(event.clientX)}
        onSlideTouchStart={(event) => {
          const touch = event.targetTouches[0];
          handleSlideStart(touch.clientX);
        }}
        onSlideTouchMove={(event) => {
          const touch = event.targetTouches[0];
          handleSlideMove(touch.clientX);
        }}
      >
        <SliderOrientationContext.Provider
          value={React.useMemo(() => ({ startEdge: 'left', endEdge: 'right', size: 'width' }), [])}
        >
          {children}
        </SliderOrientationContext.Provider>
      </SliderPart>
    );
  }
);

const SliderVertical = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderOrientationProps>(
  function SliderVertical(props, forwardedRef) {
    const { onSlideStart, onSlideMove, children, ...sliderProps } = props;
    const sliderRef = React.useRef<React.ElementRef<typeof SliderPart>>(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rect = useRect(sliderRef);

    function handleSlideStart(pointerPosition: number) {
      if (rect) onSlideStart?.(pointerPosition, rect.height, rect.top);
    }

    function handleSlideMove(pointerPosition: number) {
      if (rect) onSlideMove?.(pointerPosition, rect.height, rect.top);
    }

    return (
      <SliderPart
        {...sliderProps}
        ref={ref}
        onSlideMouseDown={(event) => handleSlideStart(event.clientY)}
        onSlideMouseMove={(event) => handleSlideMove(event.clientY)}
        onSlideTouchStart={(event) => {
          const touch = event.targetTouches[0];
          handleSlideStart(touch.clientY);
        }}
        onSlideTouchMove={(event) => {
          const touch = event.targetTouches[0];
          handleSlideMove(touch.clientY);
        }}
      >
        <SliderOrientationContext.Provider
          value={React.useMemo(() => ({ startEdge: 'top', endEdge: 'bottom', size: 'height' }), [])}
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

type SliderPartDOMProps = React.ComponentProps<typeof SLIDER_DEFAULT_TAG>;
type SliderPartOwnProps = {
  onSlideMouseDown(event: React.MouseEvent): void;
  onSlideMouseMove(event: MouseEvent): void;
  onSlideTouchStart(event: React.TouchEvent): void;
  onSlideTouchMove(event: TouchEvent): void;
};
type SliderPartProps = SliderPartDOMProps & SliderPartOwnProps;

const SliderPart = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderPartProps, SliderStaticProps>(
  function SliderPart(props, forwardedRef) {
    const {
      as: Comp = SLIDER_DEFAULT_TAG,
      onSlideMouseDown,
      onSlideMouseMove,
      onSlideTouchStart,
      onSlideTouchMove,
      ...sliderProps
    } = props;
    const handleSlideMouseMove = useCallbackRef(onSlideMouseMove);
    const handleSlideTouchMove = useCallbackRef(onSlideTouchMove);
    const removeMouseEventListeners = useCallbackRef(() => {
      document.removeEventListener('mousemove', handleSlideMouseMove);
      document.removeEventListener('mouseup', removeMouseEventListeners);
    });
    const removeTouchEventListeners = useCallbackRef(() => {
      document.removeEventListener('touchmove', handleSlideTouchMove);
      document.removeEventListener('touchend', removeTouchEventListeners);
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
            if (!isThumb(event.target)) onSlideMouseDown?.(event);
            document.addEventListener('mousemove', handleSlideMouseMove);
            document.addEventListener('mouseup', removeMouseEventListeners);
          }
        })}
        onTouchStart={composeEventHandlers(props.onTouchStart, (event) => {
          if (!isThumb(event.target)) onSlideTouchStart?.(event);
          document.addEventListener('touchmove', handleSlideTouchMove);
          document.addEventListener('touchend', removeTouchEventListeners);
          // Prevent scrolling for touch events
          event.preventDefault();
        })}
      />
    );
  }
);

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
    getValuePercent(value, context.min, context.max)
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
    const { as: Comp = THUMB_DEFAULT_TAG, style, index, value, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME);
    const orientation = React.useContext(SliderOrientationContext);
    const thumbRef = React.useRef<HTMLSpanElement>(null);
    const ref = useComposedRefs(forwardedRef, thumbRef);
    const focusTimerRef = React.useRef<number>(0);
    const size = useSize(thumbRef);
    const percent = getValuePercent(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    /**
     * We offset the thumb centre point while sliding to ensure it remains
     * within the bounds of the slider when it reaches the edges
     */
    const orientationSize = size?.[orientation.size];
    const offset = orientationSize ? getElementOffset(orientationSize, percent) : 0;

    useChangeEffect(() => {
      /**
       * Browsers fire event handlers before executing their event implementation
       * so they can check if `preventDefault` was called first. Therefore,
       * if we focus the thumb during `mousedown`, the browser will execute
       * their `mousedown` implementation after our focus which will instantly
       * `blur` the thumb again (because it effectively clicks off the thumb).
       *
       * We use a `setTimeout` here to move the focus to the next tick (after the
       * mousedown) to ensure focus on mousedown.
       */
      focusTimerRef.current = window.setTimeout(() => {
        const thumb = thumbRef.current;
        const activeThumbIndex = context.activeValueIndexRef.current;
        const isActive = activeThumbIndex === index;
        if (thumb && isActive && document.activeElement !== thumb) {
          thumb.focus();
        }
      }, 0);
      return () => window.clearTimeout(focusTimerRef.current);
    }, context.values);

    return (
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
        style={{ ...style, [orientation.startEdge]: `calc(${percent}% + ${offset}px)` }}
        onFocus={composeEventHandlers(props.onFocus, () => {
          context.activeValueIndexRef.current = index;
        })}
      />
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
    touchAction: 'none', // Prevent parent/window scroll when sliding on touch devices
    zIndex: 0, // create new stacking context
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
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
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

function useChangeEffect<T>(onChange = () => {}, value: T) {
  const ref = React.useRef(value);
  const handleOnChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (ref.current !== value) {
      ref.current = value;
      handleOnChange();
    }
  }, [value, handleOnChange]);
}

function sort(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function toArray(value: number | number[]): number[] {
  return Array.isArray(value) ? value : [value];
}

function isThumb(node: any): node is HTMLElement {
  const thumbAttributeName = interopDataAttr(THUMB_NAME);
  const thumbAttribute = node.getAttribute(thumbAttributeName);
  return thumbAttribute === '';
}

function getLabel(index: number, totalValues: number) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else {
    return ['Minimum', 'Maximum'][index];
  }
}

function getUpdatedValues(valueIndex: number, prevValues: number[], value: number) {
  const nextValues = [...prevValues];
  nextValues[valueIndex] = value;
  return nextValues;
}

function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}

function getValueFromPointer(
  pointerPosition: number,
  sliderSize: number,
  sliderOffset: number,
  sliderBounds: Required<SliderBoundsProps>
) {
  const { min, max } = sliderBounds;
  const value = linearScale([0, sliderSize], [min, max]);
  return value(pointerPosition - sliderOffset);
}

function getSnappedValue(value: number, sliderBounds: Required<SliderBoundsProps>) {
  const { min, max, step } = sliderBounds;
  const snapToStep = Math.round((value - min) / step) * step + min;
  return clamp(snapToStep, [min, max]);
}

function getValuePercent(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  return percentPerStep * (value - min);
}

// Prevents element positioning from breaking outside of slider bounds
function getElementOffset(width: number, left: number) {
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
