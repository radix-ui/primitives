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

declare global {
  interface FocusOptions {
    /**
     * A boolean value that should be set to `true` to force, or `false` to prevent
     * visible indication that the element is focused. If the property is not
     * specified, a browser will provide visible indication if it determines
     * that this would improve accessibility for users.
     *
     * @see
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
     */
    focusVisible?: boolean;
  }
}

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
interface SliderProps extends Omit<
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

const Slider = /* @__PURE__ */ React.forwardRef<SliderElement, SliderProps>(
  // blank line to reduce diff noise
  function Slider(props: ScopedProps<SliderProps>, forwardedRef) {
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
    const isKeyboardInteractionRef = React.useRef(false);
    const isHorizontal = orientation === 'horizontal';
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [control, setControl] = React.useState<SliderElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value) => {
        const thumbs = [...thumbRefs.current];
        thumbs[valueIndexToChangeRef.current]?.focus({
          preventScroll: true,
          focusVisible: isKeyboardInteractionRef.current,
        });
        isKeyboardInteractionRef.current = false;
        onValueChange(value);
      },
    });
    const valuesBeforeSlideStartRef = React.useRef(values);

    const initialValuesRef = React.useRef(values);
    React.useEffect(() => {
      const associatedForm = form
        ? control?.ownerDocument.getElementById(form)
        : control?.closest('form');
      if (associatedForm instanceof HTMLFormElement) {
        const reset = () => setValues(initialValuesRef.current);
        associatedForm.addEventListener('reset', reset);
        return () => associatedForm.removeEventListener('reset', reset);
      }
    }, [control, form, setValues]);

    function handleSlideStart(value: number) {
      const closestIndex = getClosestValueIndex(values, value);
      updateValues(value, closestIndex);
    }

    function handleSlideMove(value: number) {
      updateValues(value, valueIndexToChangeRef.current);
    }

    function handleSlideEnd() {
      const hasChanged = String(values) !== String(valuesBeforeSlideStartRef.current);
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
              ref={composedRefs}
              onPointerDown={composeEventHandlers(sliderProps.onPointerDown, () => {
                if (!disabled) {
                  valuesBeforeSlideStartRef.current = values;
                  isKeyboardInteractionRef.current = false;
                }
              })}
              min={min}
              max={max}
              inverted={inverted}
              onSlideStart={disabled ? undefined : handleSlideStart}
              onSlideMove={disabled ? undefined : handleSlideMove}
              onSlideEnd={disabled ? undefined : handleSlideEnd}
              onHomeKeyDown={() => {
                if (!disabled) {
                  isKeyboardInteractionRef.current = true;
                  updateValues(min, 0, { commit: true });
                }
              }}
              onEndKeyDown={() => {
                if (!disabled) {
                  isKeyboardInteractionRef.current = true;
                  updateValues(max, values.length - 1, { commit: true });
                }
              }}
              onStepKeyDown={({ event, direction: stepDirection }) => {
                if (!disabled) {
                  isKeyboardInteractionRef.current = true;
                  const isPageKey = PAGE_KEYS.includes(event.key);
                  const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
                  const multiplier = isSkipKey ? 10 : 1;
                  const atIndex = valueIndexToChangeRef.current;
                  const value = values[atIndex]!;
                  const nextValue = getNextStepValue(value, {
                    min,
                    step,
                    direction: stepDirection,
                    multiplier,
                  });
                  updateValues(nextValue, atIndex, { commit: true });
                }
              }}
            />
          </Collection.Slot>
        </Collection.Provider>
      </SliderProvider>
    );
  },
);

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
  extends Omit<SliderImplProps, keyof SliderImplPrivateProps>, SliderOrientationPrivateProps {}

type SliderHorizontalElement = SliderImplElement;
interface SliderHorizontalProps extends SliderOrientationProps {
  dir?: Direction;
}

const SliderHorizontal = /* @__PURE__ */ React.forwardRef<
  SliderHorizontalElement,
  SliderHorizontalProps
>(
  // blank line to reduce diff noise
  function SliderHorizontal(props: ScopedProps<SliderHorizontalProps>, forwardedRef) {
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
    const composedRefs = useComposedRefs(forwardedRef, setSlider);
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
            '--radix-slider-thumb-transform': 'translateX(-50%)',
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderVertical
 * -----------------------------------------------------------------------------------------------*/

type SliderVerticalElement = SliderImplElement;
interface SliderVerticalProps extends SliderOrientationProps {}

const SliderVertical = /* @__PURE__ */ React.forwardRef<SliderVerticalElement, SliderVerticalProps>(
  function SliderVertical(props: ScopedProps<SliderVerticalProps>, forwardedRef) {
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
            '--radix-slider-thumb-transform': 'translateY(50%)',
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

type SliderImplElement = React.ComponentRef<typeof Primitive.span>;
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

const SliderImpl = /* @__PURE__ */ React.forwardRef<SliderImplElement, SliderImplProps>(
  function SliderImpl(props: ScopedProps<SliderImplProps>, forwardedRef) {
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
    const isDragging = React.useRef(false);

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
          isDragging.current = true;
          // Prevent browser focus behaviour because we focus a thumb manually when values change.
          event.preventDefault();
          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (context.thumbs.has(target)) {
            // Pointer interaction, so avoid showing the focus ring (`:focus-visible`).
            target.focus({ preventScroll: true, focusVisible: false });
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
            isDragging.current = false;
          }
        })}
        onLostPointerCapture={composeEventHandlers(props.onLostPointerCapture, (event) => {
          if (isDragging.current) {
            onSlideEnd(event);
          }
          isDragging.current = false;
        })}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'SliderTrack';

type SliderTrackElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SliderTrackProps extends PrimitiveSpanProps {}

const SliderTrack = /* @__PURE__ */ React.forwardRef<SliderTrackElement, SliderTrackProps>(
  function SliderTrack(props: ScopedProps<SliderTrackProps>, forwardedRef) {
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'SliderRange';

type SliderRangeElement = React.ComponentRef<typeof Primitive.span>;
interface SliderRangeProps extends PrimitiveSpanProps {}

const SliderRange = /* @__PURE__ */ React.forwardRef<SliderRangeElement, SliderRangeProps>(
  function SliderRange(props: ScopedProps<SliderRangeProps>, forwardedRef) {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map((value) =>
      convertValueToPercentage(value, context.min, context.max),
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SliderThumb';

type SliderThumbContextValue = {
  value: number | undefined;
  name: string | undefined;
  form: string | undefined;
  isFormControl: boolean;
  index: number;
  thumb: SliderThumbTriggerElement | null;
  onThumbChange(thumb: SliderThumbTriggerElement | null): void;
  percent: number;
  size: ReturnType<typeof useSize>;
};

const [SliderThumbContextProvider, useSliderThumbContext] =
  createSliderContext<SliderThumbContextValue>(THUMB_NAME);

/* -------------------------------------------------------------------------------------------------
 * SliderThumbProvider
 * -----------------------------------------------------------------------------------------------*/

const THUMB_PROVIDER_NAME = 'SliderThumbProvider';

interface SliderThumbProviderProps {
  name?: string;
  children?: React.ReactNode;
}

function SliderThumbProvider(props: ScopedProps<SliderThumbProviderProps>) {
  const {
    __scopeSlider,
    name,
    children,
    // @ts-expect-error internal render prop
    internal_do_not_use_render,
  } = props;
  const context = useSliderContext(THUMB_PROVIDER_NAME, __scopeSlider);
  const getItems = useCollection(__scopeSlider);
  const [thumb, setThumb] = React.useState<SliderThumbTriggerElement | null>(null);
  const index = React.useMemo(
    () => (thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1),
    [getItems, thumb],
  );
  const size = useSize(thumb);
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = thumb ? !!context.form || !!thumb.closest('form') : true;
  // We cast because index could be `-1` which would return undefined
  const value = context.values[index] as number | undefined;
  const resolvedName =
    name ?? (context.name ? context.name + (context.values.length > 1 ? '[]' : '') : undefined);
  const percent =
    value === undefined ? 0 : convertValueToPercentage(value, context.min, context.max);

  React.useEffect(() => {
    if (thumb) {
      context.thumbs.add(thumb);
      return () => {
        context.thumbs.delete(thumb);
      };
    }
  }, [thumb, context.thumbs]);

  const thumbContext: SliderThumbContextValue = {
    value,
    name: resolvedName,
    form: context.form,
    isFormControl,
    index,
    thumb,
    onThumbChange: setThumb,
    percent,
    size,
  };

  return (
    <SliderThumbContextProvider scope={__scopeSlider} {...thumbContext}>
      {isFunction(internal_do_not_use_render) ? internal_do_not_use_render(thumbContext) : children}
    </SliderThumbContextProvider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * SliderThumbTrigger
 * -----------------------------------------------------------------------------------------------*/

const THUMB_TRIGGER_NAME = 'SliderThumbTrigger';

type SliderThumbTriggerElement = React.ComponentRef<typeof Primitive.span>;
interface SliderThumbTriggerProps extends PrimitiveSpanProps {}

const SliderThumbTrigger = /* @__PURE__ */ React.forwardRef<
  SliderThumbTriggerElement,
  SliderThumbTriggerProps
>(
  // blank line to reduce diff noise
  function SliderThumbTrigger(props: ScopedProps<SliderThumbTriggerProps>, forwardedRef) {
    const { __scopeSlider, ...thumbProps } = props;
    const context = useSliderContext(THUMB_TRIGGER_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_TRIGGER_NAME, __scopeSlider);
    const { index, value, percent, size, onThumbChange } = useSliderThumbContext(
      THUMB_TRIGGER_NAME,
      __scopeSlider,
    );
    const composedRefs = useComposedRefs(forwardedRef, onThumbChange);
    const label = getLabel(index, context.values.length);
    const orientationSize = size?.[orientation.size];
    const thumbInBoundsOffset = orientationSize
      ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction)
      : 0;

    return (
      <span
        style={{
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}
      >
        <Collection.ItemSlot scope={__scopeSlider}>
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
      </span>
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

type SliderThumbElement = SliderThumbTriggerElement;
interface SliderThumbProps extends SliderThumbTriggerProps {
  name?: string;
}

const SliderThumb = /* @__PURE__ */ React.forwardRef<SliderThumbElement, SliderThumbProps>(
  function SliderThumb(props: ScopedProps<SliderThumbProps>, forwardedRef) {
    const { __scopeSlider, name, ...thumbProps } = props;
    return (
      <SliderThumbProvider
        __scopeSlider={__scopeSlider}
        name={name}
        // @ts-expect-error internal render prop
        internal_do_not_use_render={({ index, isFormControl }: SliderThumbContextValue) => (
          <>
            <SliderThumbTrigger
              {...thumbProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeSlider={__scopeSlider}
            />
            {isFormControl ? (
              <SliderBubbleInput
                key={index}
                // @ts-expect-error
                __scopeSlider={__scopeSlider}
              />
            ) : null}
          </>
        )}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'SliderBubbleInput';

type SliderBubbleInputElement = React.ComponentRef<typeof Primitive.input>;
type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface SliderBubbleInputProps extends Omit<PrimitiveInputProps, 'value'> {}

const SliderBubbleInput = /* @__PURE__ */ React.forwardRef<
  SliderBubbleInputElement,
  SliderBubbleInputProps
>(
  // blank line to reduce diff noise
  function SliderBubbleInput(
    { __scopeSlider, ...props }: ScopedProps<SliderBubbleInputProps>,
    forwardedRef,
  ) {
    const { value, name, form } = useSliderThumbContext(BUBBLE_INPUT_NAME, __scopeSlider);
    const ref = React.useRef<SliderBubbleInputElement>(null);
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
        name={name}
        form={form}
        {...props}
        ref={composedRefs}
        defaultValue={value}
      />
    );
  },
);

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
  if (!Number.isFinite(value)) return 0;

  const str = value.toString();

  // Numbers with a magnitude below 1e-6 (or very large numbers) are serialized
  // in scientific notation (e.g. `1e-7`), so we can't just count the digits
  // after the decimal point.
  // https://github.com/radix-ui/primitives/issues/3852
  if (str.includes('e')) {
    const [coefficient, exponent] = str.split('e');
    const decimalPart = coefficient!.split('.')[1] || '';
    const exponentNum = Number(exponent);
    return Math.max(0, decimalPart.length - exponentNum);
  }

  const decimalPart = str.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValue(value: number, decimalCount: number) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}

function getNextStepValue(
  value: number,
  {
    min,
    step,
    direction,
    multiplier,
  }: {
    min: number;
    step: number;
    direction: number;
    multiplier: number;
  },
) {
  const decimalCount = getDecimalCount(step);
  const stepsFromMin = (value - min) / step;
  const nearestSteps = Math.round(stepsFromMin);
  const isAligned =
    roundValue(nearestSteps * step + min, decimalCount) === roundValue(value, decimalCount);

  let nextSteps: number;
  if (isAligned) {
    nextSteps = nearestSteps + multiplier * direction;
  } else if (direction > 0) {
    nextSteps = Math.ceil(stepsFromMin);
  } else {
    nextSteps = Math.floor(stepsFromMin);
  }

  return roundValue(nextSteps * step + min, decimalCount);
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export {
  createSliderScope,
  //
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderThumbProvider,
  SliderThumbTrigger,
  SliderBubbleInput,
  //
  Slider as Root,
  SliderTrack as Track,
  SliderRange as Range,
  SliderThumb as Thumb,
  SliderThumbProvider as ThumbProvider,
  SliderThumbTrigger as ThumbTrigger,
  SliderBubbleInput as BubbleInput,
};
export type {
  SliderProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderThumbProviderProps,
  SliderThumbTriggerProps,
  SliderBubbleInputProps,
};
