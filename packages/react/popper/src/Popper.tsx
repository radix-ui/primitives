import * as React from 'react';
import { getPlacementData } from '@interop-ui/popper';
import { useSize } from '@interop-ui/react-use-size';
import {
  createContext,
  forwardRef,
  useRect,
  createStyleObj,
  useComposedRefs,
} from '@interop-ui/react-utils';
import { Side, Align, cssReset } from '@interop-ui/utils';
import { ArrowProps, Arrow } from '@interop-ui/react-arrow';
import { useDebugContext } from '@interop-ui/react-debug-context';

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

type PopperDOMProps = React.ComponentPropsWithoutRef<typeof POPPER_DEFAULT_TAG>;
type PopperOwnProps = {
  anchorRef: React.RefObject<HTMLElement>;
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  collisionTolerance?: number;
  shouldAvoidCollisions?: boolean;
};
type PopperProps = PopperDOMProps & PopperOwnProps;

interface PopperStaticProps {
  Content: typeof PopperContent;
  Arrow: typeof PopperArrow;
}

const Popper = forwardRef<typeof POPPER_DEFAULT_TAG, PopperProps, PopperStaticProps>(
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
          {...interopDataAttrObj('root')}
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

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Popper.Content';
const CONTENT_DEFAULT_TAG = 'div';

type PopperContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type PopperContentOwnProps = {};
type PopperContentProps = PopperContentDOMProps & PopperContentOwnProps;

const PopperContent = forwardRef<typeof CONTENT_DEFAULT_TAG, PopperContentProps>(
  (props, forwardedRef) => {
    const { as: Comp = CONTENT_DEFAULT_TAG, ...contentProps } = props;
    const { contentRef } = usePopperContext(CONTENT_NAME);
    const composedContentRef = useComposedRefs(forwardedRef, contentRef);

    return <Comp {...interopDataAttrObj('content')} {...contentProps} ref={composedContentRef} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'Popper.Arrow';
const ARROW_DEFAULT_TAG = 'svg';

type PopperArrowOwnProps = {
  offset?: number;
};
type PopperArrowProps = ArrowProps & PopperArrowOwnProps;

const PopperArrow = forwardRef<typeof ARROW_DEFAULT_TAG, PopperArrowProps>(function PopperArrow(
  props,
  forwardedRef
) {
  const { as: Comp = Arrow, offset, ...arrowProps } = props;
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
        <Comp {...interopDataAttrObj('arrow')} {...arrowProps} ref={forwardedRef} />
      </span>
    </span>
  );
});

/* -----------------------------------------------------------------------------------------------*/

Popper.Content = PopperContent;
Popper.Arrow = PopperArrow;

Popper.displayName = POPPER_NAME;
Popper.Content.displayName = CONTENT_NAME;
Popper.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(POPPER_NAME, {
  root: {
    ...cssReset(POPPER_DEFAULT_TAG),
    transformOrigin: 'var(--interop-popper-transform-origin)',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
  },
});

export type { PopperProps, PopperContentProps, PopperArrowProps };
export { Popper, styles };
