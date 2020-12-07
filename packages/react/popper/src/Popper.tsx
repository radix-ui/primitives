import * as React from 'react';
import { getPlacementData } from '@interop-ui/popper';
import { useSize } from '@interop-ui/react-use-size';
import { createContext, useRect, useComposedRefs } from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { Arrow as ArrowPrimitive } from '@interop-ui/react-arrow';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { getPartDataAttrObj } from '@interop-ui/utils';

import type { Side, Align, MeasurableElement } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopperContextValue = {
  contentRef: React.RefObject<HTMLDivElement>;
  arrowRef: React.RefObject<HTMLElement>;
  setArrowOffset: (offset?: number) => void;
  arrowStyles: React.CSSProperties;
};

const [PopperContext, usePopperContext] = createContext<PopperContextValue>(
  'PopperContext',
  'Popper'
);

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper';
const POPPER_DEFAULT_TAG = 'div';

type PopperOwnProps = {
  anchorRef: React.RefObject<MeasurableElement>;
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  collisionTolerance?: number;
  shouldAvoidCollisions?: boolean;
};

const Popper = forwardRefWithAs<typeof POPPER_DEFAULT_TAG, PopperOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = POPPER_DEFAULT_TAG,
      children,
      anchorRef,
      side = 'bottom',
      sideOffset,
      align = 'center',
      alignOffset,
      collisionTolerance,
      shouldAvoidCollisions = true,
      ...popperProps
    } = props;

    const [arrowOffset, setArrowOffset] = React.useState<number>();
    const anchorRect = useRect(anchorRef);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const contentSize = useSize(contentRef);
    const arrowRef = React.useRef<HTMLSpanElement>(null);
    const arrowSize = useSize(arrowRef);
    const debugContext = useDebugContext();

    const { popperStyles, arrowStyles, placedSide, placedAlign } = getPlacementData({
      anchorRect,
      popperSize: contentSize,
      arrowSize,

      // config
      arrowOffset,
      side,
      sideOffset,
      align,
      alignOffset,
      collisionTolerance,
      shouldAvoidCollisions: shouldAvoidCollisions && !debugContext.disableCollisionChecking,
    });
    const isPlaced = placedSide !== undefined;

    const context = React.useMemo(() => ({ contentRef, arrowRef, arrowStyles, setArrowOffset }), [
      arrowStyles,
    ]);

    return (
      <div style={popperStyles}>
        <Comp
          {...getPartDataAttrObj(POPPER_NAME)}
          {...popperProps}
          style={{
            ...popperProps.style,
            // if the Popper hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            animation: !isPlaced ? 'none' : undefined,
          }}
          ref={forwardedRef}
          data-side={placedSide}
          data-align={placedAlign}
        >
          <PopperContext.Provider value={context}>{children}</PopperContext.Provider>
        </Comp>
      </div>
    );
  }
);

Popper.displayName = POPPER_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent';
const CONTENT_DEFAULT_TAG = 'div';

const PopperContent = forwardRefWithAs<typeof CONTENT_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = CONTENT_DEFAULT_TAG, ...contentProps } = props;
  const { contentRef } = usePopperContext(CONTENT_NAME);
  const composedContentRef = useComposedRefs(forwardedRef, contentRef);
  return <Comp {...getPartDataAttrObj(CONTENT_NAME)} {...contentProps} ref={composedContentRef} />;
});

PopperContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopperArrow';

type PopperArrowOwnProps = {
  offset?: number;
};

const PopperArrow = forwardRefWithAs<typeof ArrowPrimitive, PopperArrowOwnProps>(
  function PopperArrow(props, forwardedRef) {
    const { offset, ...arrowProps } = props;
    const { arrowRef, setArrowOffset, arrowStyles } = usePopperContext(ARROW_NAME);

    // send the Arrow's offset up to Popper
    React.useEffect(() => setArrowOffset(offset), [setArrowOffset, offset]);

    return (
      <span style={{ ...arrowStyles, pointerEvents: 'none' }}>
        <span
          // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
          // doesn't report size as we'd expect on SVG elements.
          // it reports their bounding box which is effectively the largest path inside the SVG.
          ref={arrowRef}
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            pointerEvents: 'auto',
          }}
        >
          <ArrowPrimitive
            {...getPartDataAttrObj(ARROW_NAME)}
            {...arrowProps}
            ref={forwardedRef}
            style={{
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: 'block',
            }}
          />
        </span>
      </span>
    );
  }
);

PopperArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Popper;
const Content = PopperContent;
const Arrow = PopperArrow;

export { Popper, PopperContent, PopperArrow, Root, Content, Arrow };
