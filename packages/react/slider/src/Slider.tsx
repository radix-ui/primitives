import * as React from 'react';
import omit from 'lodash.omit';
import { Size, cssReset, clamp, interopDataAttrObj } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
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
  'Slider.Root'
);

/* -------------------------------------------------------------------------------------------------
 * SliderRoot
 * -----------------------------------------------------------------------------------------------*/

const ROOT_DEFAULT_TAG = 'span';

type SliderRootDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof ROOT_DEFAULT_TAG>,
  'defaultValue' | 'onChange'
>;
type SliderRootControlledProps = { value: number; onChange: (value: number) => void };
type SliderRootUncontrolledProps = { defaultValue?: number; onChange?: (value: number) => void };
type SliderRangeControlledProps = { value: number[]; onChange: (value: number[]) => void };
type SliderRangeUncontrolledProps = {
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
};
type SliderRootProps = SliderRootDOMProps &
  Partial<SliderBounds> & {
    name?: string;
    disabled?: boolean;
  } & (
    | SliderRootControlledProps
    | SliderRootUncontrolledProps
    | SliderRangeControlledProps
    | SliderRangeUncontrolledProps
  );

const SliderRoot = forwardRef<typeof ROOT_DEFAULT_TAG, SliderRootProps, SliderStaticProps>(
  function SliderRoot(props, forwardedRef) {
    let {
      as: Comp = ROOT_DEFAULT_TAG,
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

    let { defaultValue } = props as SliderRootUncontrolledProps | SliderRangeUncontrolledProps;
    let { value: valueProp } = props as SliderRootControlledProps | SliderRangeControlledProps;

    let sliderProps = omit(restProps, ['defaultValue', 'value']) as SliderRootDOMProps;
    let sliderRef = React.useRef<HTMLSpanElement>(null);
    let inputRefs = React.useRef<HTMLInputElement[]>([]);
    let composedRefs = useComposedRefs(forwardedRef, sliderRef);

    let [partSizes, setPartSizes] = React.useState<{ [part in SliderParts]?: Size }>({});
    let [thumbNodes, setThumbNodes] = React.useState<SliderContextValue['thumbNodes']>(new Set());
    let [valuesState, setValuesState] = React.useState<number[]>(() => toArray(defaultValue));

    let activeValueIndexRef = React.useRef<number>(0);
    let isSlidingRef = React.useRef(false);
    let isControlled = valueProp !== undefined;
    let isDisabled = disabled;
    let step = Math.max(stepProp, 1);
    let values = toArray(isControlled ? valueProp : valuesState);
    let prevValues = usePrevious(values);
    let isRange = values.length > 1;

    // Ensure slider is as tall as its tallest part
    let partHeights = valuesOf(partSizes).map((size) => size?.height);
    let partHeightsValues = partHeights.filter(Boolean) as number[];
    let height = partHeightsValues.length ? Math.max(...partHeightsValues) : undefined;

    function updateValue(value: number, atIndex = activeValueIndexRef.current) {
      let sliderBounds = { min, max, step };
      let nextValue = getSnappedValue(value, sliderBounds);

      if (isRange) {
        let nextValues = sort(getUpdatedValues(atIndex, values, nextValue));
        let onValueRangeChange = onChange as SliderRangeControlledProps['onChange'];
        if (!isControlled) setValuesState(nextValues);
        activeValueIndexRef.current = nextValues.indexOf(nextValue);
        onValueRangeChange(nextValues);
      } else {
        let onValueChange = onChange as SliderRootControlledProps['onChange'];
        if (!isControlled) setValuesState([nextValue]);
        activeValueIndexRef.current = atIndex;
        onValueChange(nextValue);
      }

      return Promise.resolve(activeValueIndexRef.current);
    }

    function slideStart(target: HTMLElement, pointerLeft: number) {
      isSlidingRef.current = true;

      if (target.getAttribute('data-part-id') === 'thumb') {
        let thumbIndex = Array.from(thumbNodes).findIndex((node) => node.contains(target));
        activeValueIndexRef.current = thumbIndex;
        return;
      }

      let targetValue = getTargetValueFromPx(sliderRef.current!, pointerLeft, { min, max });
      let closestIndex = getClosestValueIndex(values, targetValue);

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

    let slideMove = useCallbackRef((pointerLeft: number) => {
      if (!isSlidingRef.current) return;
      let targetValue = getTargetValueFromPx(sliderRef.current!, pointerLeft, { min, max });
      updateValue(targetValue).then(focusThumb.bind(null, thumbNodes));
    });

    let slideEnd = useCallbackRef(() => (isSlidingRef.current = false));

    let handleTouchStart = useCallbackRef(
      composeEventHandlers(props.onTouchStart, (event) => {
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        slideStart(event.target as HTMLElement, event.targetTouches[0].clientX);
        // Prevent scrolling for touch events
        event.preventDefault();
      })
    );

    let handleMouseDown = useCallbackRef(
      composeEventHandlers(props.onMouseDown, (event) => {
        // Prevent sliding if main mouse button didn't trigger event (e.g. right click)
        if (event.button !== 0) return;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        slideStart(event.target as HTMLElement, event.clientX);
      })
    );

    let handleTouchMove = useCallbackRef((event: TouchEvent) =>
      slideMove(event.targetTouches[0].clientX)
    );
    let handleMouseMove = useCallbackRef((event: MouseEvent) => slideMove(event.clientX));

    let handleTouchEnd = useCallbackRef(() => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
      slideEnd();
    });

    let handleMouseUp = useCallbackRef(() => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      slideEnd();
    });

    /**
     * When sliding this will make the slider capture all subsequent pointer events.
     * This is to avoid page scrolling/text selection during slide and to cancel the
     * slide interaction if pointer is lifted outside of the current frame.
     */
    let handlePointerDown = useCallbackRef((event: PointerEvent) => {
      const slider = sliderRef.current!;
      slider.setPointerCapture(event.pointerId);
      slider.addEventListener('pointerup', handlePointerUp);
    });

    // Ensures slide is cancelled if pointer is lifted outside of document
    let handlePointerUp = (event: PointerEvent) => {
      const slider = sliderRef.current!;
      slider.removeEventListener('pointerdown', handlePointerDown);
      slider.removeEventListener('pointerup', handlePointerUp);
      slider.releasePointerCapture(event.pointerId);
      slideEnd();
    };

    let handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
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
        let value = values[activeValueIndexRef.current];
        let isSkipPageKey = PAGE_KEYS.includes(event.key);
        let isSkipShiftKey = event.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(event.key);
        let isSkipSteps = isSkipPageKey || isSkipShiftKey;
        let isBackKey = BACK_KEYS.includes(event.key);
        let direction = isBackKey ? -1 : 1;
        let multiplier = isSkipSteps ? 10 : 1;
        let stepInDirection = step * multiplier * direction;
        let toValue = value + stepInDirection;
        nextValue = toValue;
      }

      updateValue(nextValue, atIndex).then(focusThumb.bind(null, thumbNodes));
    });

    React.useEffect(() => {
      if (isDisabled) return;
      let slider = sliderRef.current!;

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
      let hasValuesChanged = prevValues && prevValues !== values;
      // If there is no name, the consumer isn't expecting this field to be part of form data
      if (!hasValuesChanged || !name) return;

      let inputProto = window.HTMLInputElement.prototype;
      let { set } = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor;

      inputRefs.current.forEach((input, index) => {
        if (set) {
          let event = new Event('input', { bubbles: true });
          set.call(input, values[index]);
          input.dispatchEvent(event);
        }
      });
    }, [name, prevValues, values]);

    let updateSize = React.useCallback((part: SliderParts, size: Size) => {
      setPartSizes((prevPartSizes) => ({ ...prevPartSizes, [part]: size }));
    }, []);

    let addThumb = React.useCallback((node: React.ElementRef<typeof SliderThumb>) => {
      setThumbNodes((prevNodes) => new Set(prevNodes.add(node)));
    }, []);

    let removeThumb = React.useCallback((node: React.ElementRef<typeof SliderThumb>) => {
      setThumbNodes((prevNodes) => {
        let nextNodes = new Set(prevNodes);
        nextNodes.delete(node);
        return nextNodes;
      });
    }, []);

    let selectThumb = React.useCallback(
      (node: React.ElementRef<typeof SliderThumb>) => {
        let index = Array.from(thumbNodes).findIndex((thumbNode) => thumbNode === node);
        activeValueIndexRef.current = index;
      },
      [thumbNodes]
    );

    let context = React.useMemo(
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
          {...interopDataAttrObj('SliderRoot')}
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

SliderRoot.displayName = 'Slider.Root';

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_DEFAULT_TAG = 'span';

type SliderTrackDOMProps = React.ComponentPropsWithoutRef<typeof TRACK_DEFAULT_TAG>;
type SliderTrackOwnProps = {};
type SliderTrackProps = SliderTrackDOMProps & SliderTrackOwnProps;

const SliderTrack = forwardRef<typeof TRACK_DEFAULT_TAG, SliderTrackProps>(function SliderTrack(
  props,
  forwardedRef
) {
  let { as: Comp = TRACK_DEFAULT_TAG, ...trackProps } = props;
  let context = useSliderContext('Slider.Track');
  let ref = React.useRef<HTMLSpanElement>(null);
  let composedRefs = useComposedRefs(forwardedRef, ref);
  let size = useSize({ refToObserve: ref, isObserving: true });
  let prevSize = usePrevious(size);

  React.useLayoutEffect(() => {
    if (size && prevSize !== size) {
      context.updateSize('track', size);
    }
  }, [context, prevSize, size]);

  return <Comp {...interopDataAttrObj('SliderTrack')} {...trackProps} ref={composedRefs} />;
});

SliderTrack.displayName = 'Slider.Track';

/* -------------------------------------------------------------------------------------------------
 * SliderTrackMask
 * -----------------------------------------------------------------------------------------------*/

const MASK_DEFAULT_TAG = 'span';

type SliderTrackMaskDOMProps = React.ComponentPropsWithoutRef<typeof MASK_DEFAULT_TAG>;
type SliderTrackMaskOwnProps = {};
type SliderTrackMaskProps = SliderTrackMaskDOMProps & SliderTrackMaskOwnProps;

const SliderTrackMask = forwardRef<typeof MASK_DEFAULT_TAG, SliderTrackMaskProps>(
  function SliderTrackMask(props, forwardedRef) {
    let { as: Comp = MASK_DEFAULT_TAG, ...maskProps } = props;
    return <Comp {...interopDataAttrObj('SliderTrackMask')} {...maskProps} ref={forwardedRef} />;
  }
);

SliderTrackMask.displayName = 'Slider.TrackMask';

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_DEFAULT_TAG = 'span';

type SliderRangeProps = Omit<React.ComponentPropsWithoutRef<typeof RANGE_DEFAULT_TAG>, 'children'>;

const SliderRange = forwardRef<typeof RANGE_DEFAULT_TAG, SliderRangeProps>(function SliderRange(
  props,
  forwardedRef
) {
  let { as: Comp = RANGE_DEFAULT_TAG, style, ...rangeProps } = props;
  let context = useSliderContext('Slider.Range');
  let ref = React.useRef<HTMLSpanElement>(null);
  let composedRefs = useComposedRefs(forwardedRef, ref);
  let valuesCount = context.values.length;
  let percentages = context.values.map((value) => getValuePercent(value, context.min, context.max));
  let left = valuesCount > 1 ? Math.min(...percentages) : 0;
  let right = 100 - Math.max(...percentages);

  return (
    <Comp
      {...interopDataAttrObj('SliderRange')}
      {...rangeProps}
      ref={composedRefs}
      style={{ left: left + '%', right: right + '%', ...style }}
    />
  );
});

SliderRange.displayName = 'Slider.Range';

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_DEFAULT_TAG = 'span';

type SliderThumbDOMProps = React.ComponentPropsWithoutRef<typeof THUMB_DEFAULT_TAG>;
type SliderThumbOwnProps = {};
type SliderThumbProps = SliderThumbDOMProps & SliderThumbOwnProps;

const SliderThumb = forwardRef<typeof THUMB_DEFAULT_TAG, SliderThumbProps>(function SliderThumb(
  props,
  forwardedRef
) {
  let { as: Comp = THUMB_DEFAULT_TAG, onFocus, style, ...thumbProps } = props;
  let context = useSliderContext('Slider.Thumb');

  // destructure for references so that we don't need `context` as effect dependency
  let { updateSize, addThumb, removeThumb, thumbNodes, values } = context;
  let ref = React.useRef<HTMLSpanElement>(null);
  let size = useSize({ refToObserve: ref, isObserving: true });
  let prevSize = usePrevious(size);
  let composedRefs = useComposedRefs(forwardedRef, ref);

  let index = [...thumbNodes].findIndex((node) => node === ref.current);
  let value = values[index];
  let left = getValuePercent(value, context.min, context.max);
  let xOffset = size?.width ? getElementOffset(size.width, left) : 0;
  let label = getLabel();

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
      {...interopDataAttrObj('SliderThumb')}
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

SliderThumb.displayName = 'Slider.Thumb';

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

type SliderProps = SliderRootProps;

const Slider = forwardRef<typeof ROOT_DEFAULT_TAG, SliderProps, SliderStaticProps>(function Slider(
  props,
  forwardedRef
) {
  let { children, ...rootProps } = props;
  return (
    <SliderRoot ref={forwardedRef} {...rootProps}>
      <SliderTrack>
        <SliderTrackMask>
          <SliderRange />
        </SliderTrackMask>
        {children}
      </SliderTrack>
    </SliderRoot>
  );
});

Slider.displayName = 'Slider';

/* -----------------------------------------------------------------------------------------------*/

Slider.Root = SliderRoot;
Slider.Track = SliderTrack;
Slider.TrackMask = SliderTrackMask;
Slider.Range = SliderRange;
Slider.Thumb = SliderThumb;

interface SliderStaticProps {
  Root: typeof SliderRoot;
  Track: typeof SliderTrack;
  TrackMask: typeof SliderTrackMask;
  Range: typeof SliderRange;
  Thumb: typeof SliderThumb;
}

const styles = {
  root: {
    ...cssReset(ROOT_DEFAULT_TAG),
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    flexShrink: 0,
    userSelect: 'none',
    touchAction: 'none', // Prevent parent/window scroll when sliding on touch devices
    zIndex: 0, // create new stacking context
  },
  'root.state.disabled': {
    pointerEvents: 'none',
  },
  track: {
    ...cssReset(TRACK_DEFAULT_TAG),
    display: 'block',
    position: 'relative',
    flexGrow: 1,
  },
  trackMask: {
    ...cssReset(MASK_DEFAULT_TAG),
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 'inherit',
    overflow: 'hidden',
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
};

export type {
  SliderRootProps,
  SliderRangeProps,
  SliderTrackProps,
  SliderTrackMaskProps,
  SliderThumbProps,
  SliderProps,
};
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
