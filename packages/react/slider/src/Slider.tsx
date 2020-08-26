import * as React from 'react';
import omit from 'lodash.omit';
import { Size, cssReset, clamp, interopDataAttr, isUndefined } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
  usePrevious,
} from '@interop-ui/react-utils';
import { useSize } from '@interop-ui/react-use-size';

const PAGE_KEYS = ['PageUp', 'PageDown'];
const BACK_KEYS = ['ArrowDown', 'ArrowLeft', 'Home', 'PageDown'];
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
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type SliderContextValue = {
  min: number;
  max: number;
  values: number[];
  thumbNodes: Set<React.ElementRef<typeof SliderThumb>>;
  isDisabled: boolean;
  updateSize: (part: SliderParts, size: Size) => void;
  addThumb: (node: React.ElementRef<typeof SliderThumb>) => void;
  removeThumb: (node: React.ElementRef<typeof SliderThumb>) => void;
  selectThumb: (node: React.ElementRef<typeof SliderThumb>) => void;
};

const [SliderContext, useSliderContext] = createContext<SliderContextValue>(
  'SliderContext',
  'Slider'
);

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

const SLIDER_NAME = 'Slider';
const SLIDER_DEFAULT_TAG = 'span';

type SliderDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof SLIDER_DEFAULT_TAG>,
  'defaultValue' | 'onChange'
>;
type SliderControlledProps = { value: number; onChange: (value: number) => void };
type SliderUncontrolledProps = { defaultValue?: number; onChange?: (value: number) => void };
type SliderRangeControlledProps = { value: number[]; onChange: (value: number[]) => void };
type SliderRangeUncontrolledProps = {
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
};
type SliderProps = SliderDOMProps &
  Partial<SliderBounds> & {
    name?: string;
    disabled?: boolean;
  } & (
    | SliderControlledProps
    | SliderUncontrolledProps
    | SliderRangeControlledProps
    | SliderRangeUncontrolledProps
  );

const Slider = forwardRef<typeof SLIDER_DEFAULT_TAG, SliderProps, SliderStaticProps>(
  function Slider(props, forwardedRef) {
    const {
      as: Comp = SLIDER_DEFAULT_TAG,
      children,
      name,
      min = 0,
      max = 100,
      step: stepProp = 1,
      disabled = false,
      onChange = () => {},
      style,
      ...restProps
    } = props;

    const { defaultValue } = props as SliderUncontrolledProps | SliderRangeUncontrolledProps;
    const { value: valueProp } = props as SliderControlledProps | SliderRangeControlledProps;

    const sliderProps = omit(restProps, ['defaultValue', 'value']) as SliderDOMProps;
    const sliderRef = React.useRef<HTMLSpanElement>(null);
    const inputRefs = React.useRef<HTMLInputElement[]>([]);
    const composedRefs = useComposedRefs(forwardedRef, sliderRef);

    const [partSizes, setPartSizes] = React.useState<{ [part in SliderParts]?: Size }>({});
    const [thumbNodes, setThumbNodes] = React.useState<SliderContextValue['thumbNodes']>(new Set());
    const [valuesState, setValuesState] = React.useState<number[]>(() => toArray(defaultValue));

    const activeValueIndexRef = React.useRef<number>(0);
    const isSlidingRef = React.useRef(false);
    const isControlled = valueProp !== undefined;
    const isDisabled = disabled;
    const step = Math.max(stepProp, 1);
    const values = toArray(isControlled ? valueProp : valuesState);
    const prevValues = usePrevious(values);
    const isRange = values.length > 1;

    // Ensure slider is as tall as its tallest part
    const partHeights = valuesOf(partSizes).map((size) => size?.height);
    const partHeightsValues = partHeights.filter(Boolean) as number[];
    const height = partHeightsValues.length ? Math.max(...partHeightsValues) : undefined;

    function updateValue(value: number, atIndex = activeValueIndexRef.current) {
      const sliderBounds = { min, max, step };
      const nextValue = getSnappedValue(value, sliderBounds);

      if (isRange) {
        const nextValues = sort(getUpdatedValues(atIndex, values, nextValue));
        const onValueRangeChange = onChange as SliderRangeControlledProps['onChange'];
        if (!isControlled) setValuesState(nextValues);
        activeValueIndexRef.current = nextValues.indexOf(nextValue);
        onValueRangeChange(nextValues);
      } else {
        const onValueChange = onChange as SliderControlledProps['onChange'];
        if (!isControlled) setValuesState([nextValue]);
        activeValueIndexRef.current = atIndex;
        onValueChange(nextValue);
      }

      return Promise.resolve(activeValueIndexRef.current);
    }

    function slideStart(target: HTMLElement, pointerLeft: number) {
      const thumbAttributeName = interopDataAttr(THUMB_NAME);
      const thumbAttribute = target.getAttribute(thumbAttributeName);
      isSlidingRef.current = true;

      if (!isUndefined(thumbAttribute)) {
        const thumbIndex = Array.from(thumbNodes).findIndex((node) => node.contains(target));
        activeValueIndexRef.current = thumbIndex;
        return;
      }

      const targetValue = getTargetValueFromPx(sliderRef.current!, pointerLeft, { min, max });
      const closestIndex = getClosestValueIndex(values, targetValue);

      updateValue(targetValue, closestIndex).then((activeValueIndex) => {
        /**
         * Browsers fire handlers before executing their event implementation so
         * they can check if `preventDefault` was called first. Therefore,
         * if we focus the thumb during `mousedown`, the browser will execute
         * their `mousedown` implementation after the focus which will instantly
         * `blur` the thumb again (because it effectively clicks off the thumb).
         * We use a `setTimeout` here to move the focus to the next tick (after the
         * mousedown) to prevent this.
         *
         * We cannot use `event.preventDefault()` to prevent the blur because it
         * also prevents PointerEvents which we need to maintain.
         */
        setTimeout(() => focusThumb(thumbNodes, activeValueIndex), 0);
      });
    }

    const slideMove = useCallbackRef((pointerLeft: number) => {
      if (!isSlidingRef.current) return;
      const targetValue = getTargetValueFromPx(sliderRef.current!, pointerLeft, { min, max });
      updateValue(targetValue).then(focusThumb.bind(null, thumbNodes));
    });

    const slideEnd = useCallbackRef(() => (isSlidingRef.current = false));

    const handleTouchStart = useCallbackRef(
      composeEventHandlers(props.onTouchStart, (event) => {
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        slideStart(event.target as HTMLElement, event.targetTouches[0].clientX);
        // Prevent scrolling for touch events
        event.preventDefault();
      })
    );

    const handleMouseDown = useCallbackRef(
      composeEventHandlers(props.onMouseDown, (event) => {
        // Prevent sliding if main mouse button didn't trigger event (e.g. right click)
        if (event.button !== 0) return;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        slideStart(event.target as HTMLElement, event.clientX);
      })
    );

    const handleTouchMove = useCallbackRef((event: TouchEvent) =>
      slideMove(event.targetTouches[0].clientX)
    );
    const handleMouseMove = useCallbackRef((event: MouseEvent) => slideMove(event.clientX));

    const handleTouchEnd = useCallbackRef(() => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
      slideEnd();
    });

    const handleMouseUp = useCallbackRef(() => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      slideEnd();
    });

    /**
     * When sliding this will make the slider capture all subsequent pointer events.
     * This is to avoid page scrolling/text selection during slide and to cancel the
     * slide interaction if pointer is lifted outside of the current frame.
     */
    const handlePointerDown = useCallbackRef((event: PointerEvent) => {
      const slider = sliderRef.current!;
      slider.setPointerCapture(event.pointerId);
      slider.addEventListener('pointerup', handlePointerUp);
    });

    // Ensures slide is cancelled if pointer is lifted outside of document
    const handlePointerUp = (event: PointerEvent) => {
      const slider = sliderRef.current!;
      slider.removeEventListener('pointerdown', handlePointerDown);
      slider.removeEventListener('pointerup', handlePointerUp);
      slider.releasePointerCapture(event.pointerId);
      slideEnd();
    };

    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      if (!SLIDER_KEYS.includes(event.key)) return;
      let atIndex;
      let nextValue;

      if (event.key === 'Home') {
        atIndex = 0;
        nextValue = min;
      } else if (event.key === 'End') {
        atIndex = values.length - 1;
        nextValue = max;
      } else {
        const value = values[activeValueIndexRef.current];
        const isSkipPageKey = PAGE_KEYS.includes(event.key);
        const isSkipShiftKey = event.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(event.key);
        const isSkipSteps = isSkipPageKey || isSkipShiftKey;
        const isBackKey = BACK_KEYS.includes(event.key);
        const direction = isBackKey ? -1 : 1;
        const multiplier = isSkipSteps ? 10 : 1;
        const stepInDirection = step * multiplier * direction;
        const toValue = value + stepInDirection;
        nextValue = toValue;
      }

      updateValue(nextValue, atIndex).then(focusThumb.bind(null, thumbNodes));
    });

    React.useEffect(() => {
      if (isDisabled) return;
      const slider = sliderRef.current!;

      slider.addEventListener('mousedown', handleMouseDown);
      slider.addEventListener('touchstart', handleTouchStart);

      if ('PointerEvent' in window) {
        slider.addEventListener('pointerdown', handlePointerDown);
      }

      return () => {
        slider.removeEventListener('mousedown', handleMouseDown);
        slider.removeEventListener('touchstart', handleTouchStart);
      };
    }, [isDisabled, handlePointerDown, handleMouseDown, handleTouchStart, slideEnd]);

    // Bubble value change to parents (for uncontrolled forms)
    React.useEffect(() => {
      const hasValuesChanged = prevValues && prevValues !== values;
      // If there is no name, the consumer isn't expecting this field to be part of form data
      if (!hasValuesChanged || !name) return;

      const inputProto = window.HTMLInputElement.prototype;
      const { set } = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor;

      inputRefs.current.forEach((input, index) => {
        if (set) {
          const event = new Event('input', { bubbles: true });
          set.call(input, values[index]);
          input.dispatchEvent(event);
        }
      });
    }, [name, prevValues, values]);

    const updateSize = React.useCallback((part: SliderParts, size: Size) => {
      setPartSizes((prevPartSizes) => ({ ...prevPartSizes, [part]: size }));
    }, []);

    const addThumb = React.useCallback((node: React.ElementRef<typeof SliderThumb>) => {
      setThumbNodes((prevNodes) => new Set(prevNodes.add(node)));
    }, []);

    const removeThumb = React.useCallback((node: React.ElementRef<typeof SliderThumb>) => {
      setThumbNodes((prevNodes) => {
        const nextNodes = new Set(prevNodes);
        nextNodes.delete(node);
        return nextNodes;
      });
    }, []);

    const selectThumb = React.useCallback(
      (node: React.ElementRef<typeof SliderThumb>) => {
        const index = Array.from(thumbNodes).findIndex((thumbNode) => thumbNode === node);
        activeValueIndexRef.current = index;
      },
      [thumbNodes]
    );

    const context = React.useMemo(
      () => ({
        min,
        max,
        values,
        thumbNodes,
        isDisabled,
        updateSize,
        addThumb,
        removeThumb,
        selectThumb,
      }),
      [min, max, values, thumbNodes, isDisabled, updateSize, addThumb, removeThumb, selectThumb]
    );

    return (
      <SliderContext.Provider value={context}>
        <Comp
          {...interopDataAttrObj('root')}
          {...sliderProps}
          ref={composedRefs}
          onKeyDown={isDisabled ? undefined : handleKeyDown}
          style={{ height, ...style }}
        >
          {children}

          {/**
           * When consumer provides `name`, they are most likely uncontrolling so
           * we render `input`s that will dispatch the values.
           *
           * We purposefully do not use `type="hidden"` here otherwise forms that
           * wrap it will not be able to access its value via the FormData API.
           *
           * We purposefully do not add the `value` attribute here to allow the value
           * to be set programatically and bubbled to any parent form `onChange` event.
           * Adding the `value` will cause React to consider the programatic
           * dispatch a duplicate and it will get swallowed.
           */}
          {name &&
            values.map((value, index) => (
              <input
                key={index}
                name={name + (isRange ? '[]' : '')}
                ref={(ref) => ref && (inputRefs.current[index] = ref)}
                hidden
              />
            ))}
        </Comp>
      </SliderContext.Provider>
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
  const context = useSliderContext(TRACK_NAME);
  const ref = React.useRef<HTMLSpanElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const size = useSize({ refToObserve: ref, isObserving: true });
  const prevSize = usePrevious(size);

  React.useLayoutEffect(() => {
    if (size && prevSize !== size) {
      context.updateSize('track', size);
    }
  }, [context, prevSize, size]);

  return (
    <Comp {...interopDataAttrObj('track')} {...trackProps} ref={composedRefs}>
      <span
        style={{
          display: 'block',
          height: '100%',
          position: 'relative',
          borderRadius: 'inherit',
          overflow: 'hidden',
        }}
      >
        {children}
      </span>
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
  const ref = React.useRef<HTMLSpanElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const valuesCount = context.values.length;
  const percentages = context.values.map((value) =>
    getValuePercent(value, context.min, context.max)
  );
  const left = valuesCount > 1 ? Math.min(...percentages) : 0;
  const right = 100 - Math.max(...percentages);

  return (
    <Comp
      {...interopDataAttrObj('range')}
      {...rangeProps}
      ref={composedRefs}
      style={{ left: left + '%', right: right + '%', ...style }}
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

const SliderThumb = forwardRef<typeof THUMB_DEFAULT_TAG, SliderThumbProps>(function SliderThumb(
  props,
  forwardedRef
) {
  const { as: Comp = THUMB_DEFAULT_TAG, onFocus, style, ...thumbProps } = props;
  const context = useSliderContext(THUMB_NAME);

  // destructure for references so that we don't need `context` as effect dependency
  const { updateSize, addThumb, removeThumb, thumbNodes } = context;
  const ref = React.useRef<HTMLSpanElement>(null);
  const size = useSize({ refToObserve: ref, isObserving: true });
  const prevSize = usePrevious(size);
  const composedRefs = useComposedRefs(forwardedRef, ref);

  const index = [...thumbNodes].findIndex((node) => node === ref.current);
  const value = context.values[index] ?? context.min;
  const left = getValuePercent(value, context.min, context.max);
  const xOffset = size?.width ? getElementOffset(size.width, left) : 0;
  const label = getLabel();

  function getLabel() {
    if (context.values.length === 2) {
      return index === 0 ? 'Minimum' : 'Maximum';
    } else if (context.values.length > 2) {
      // Not perfect but gives user some context
      return `Value ${index + 1} of ${context.values.length}`;
    }
    return undefined;
  }

  function handleFocus(event: React.FocusEvent<any>) {
    context.selectThumb(event.currentTarget);
  }

  React.useLayoutEffect(() => {
    const node = ref.current as HTMLSpanElement;
    addThumb(node);
    return () => removeThumb(node);
  }, [addThumb, removeThumb]);

  React.useLayoutEffect(() => {
    if (size && prevSize !== size) {
      updateSize('thumb', size);
    }
  }, [updateSize, prevSize, size]);

  return (
    <Comp
      {...interopDataAttrObj('thumb')}
      aria-label={props['aria-label'] || label}
      aria-valuemin={context.min}
      aria-valuenow={value}
      aria-valuemax={context.max}
      aria-orientation="horizontal"
      role="slider"
      tabIndex={0}
      {...thumbProps}
      ref={composedRefs}
      style={{ left: `calc(${left}% + ${xOffset}px)`, ...style }}
      onFocus={composeEventHandlers(onFocus, handleFocus)}
    />
  );
});

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
    alignItems: 'center',
    width: '100%',
    flexShrink: 0,
    userSelect: 'none',
    touchAction: 'none', // Prevent parent/window scroll when sliding on touch devices
    zIndex: 0, // create new stacking context
  },
  track: {
    ...cssReset(TRACK_DEFAULT_TAG),
    display: 'block',
    position: 'relative',
    flexGrow: 1,
  },
  range: {
    ...cssReset(RANGE_DEFAULT_TAG),
    display: 'block',
    position: 'absolute',
    height: '100%',
  },
  thumb: {
    ...cssReset(THUMB_DEFAULT_TAG),
    display: 'block',
    position: 'absolute',
    top: '50%',
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

export type { SliderProps, SliderRangeProps, SliderTrackProps, SliderThumbProps };
export { Slider, styles };

/* -----------------------------------------------------------------------------------------------*/

function valuesOf<T>(object: T) {
  return typeof Object.values !== 'undefined'
    ? Object.values(object)
    : Object.keys(object).map((key) => object[key as keyof T]);
}

function sort(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function toArray(value?: number | number[]): number[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function focusThumb(thumbNodes: Set<HTMLElement>, thumbIndex: number) {
  const activeThumb = Array.from(thumbNodes)[thumbIndex];
  if (activeThumb) activeThumb.focus();
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

function getSnappedValue(value: number, sliderBounds: SliderBounds) {
  const { min, max, step } = sliderBounds;
  const snapToStep = Math.round((value - min) / step) * step + min;
  return clamp(snapToStep, [min, max]);
}

function getTargetValueFromPx(
  slider: HTMLElement,
  pointerLeft: number,
  sliderBounds: Pick<SliderBounds, 'min' | 'max'>
) {
  const { min, max } = sliderBounds;
  const sliderRect = slider.getBoundingClientRect();
  const value = linearScale([0, sliderRect.width], [min, max]);
  return value(pointerLeft - sliderRect.left);
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

type SliderParts = 'track' | 'range' | 'thumb';

type SliderBounds = {
  min: number;
  max: number;
  step: number;
};
