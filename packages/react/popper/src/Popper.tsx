import * as React from 'react';
import { getPlacementData } from '@interop-ui/popper';
import { useSize } from '@interop-ui/react-use-size';
import {
  createContext,
  forwardRef,
  useRect,
  useComposedRefs,
  createStyleObj,
} from '@interop-ui/react-utils';
import { Side, Align, cssReset } from '@interop-ui/utils';
import { ArrowProps, Arrow } from '@interop-ui/react-arrow';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type PopperContextValue = {
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
    const popperRef = React.useRef<HTMLDivElement>(null);
    const popperSize = useSize(popperRef);
    const arrowRef = React.useRef<HTMLSpanElement>(null);
    const arrowSize = useSize(arrowRef);
    const composedPopperRef = useComposedRefs(forwardedRef, popperRef);

    const { popperStyles, arrowStyles } = getPlacementData({
      targetRect: anchorRect,
      popperSize: popperSize,
      arrowSize,

      // config
      arrowOffset,
      side,
      sideOffset,
      align,
      alignOffset,
      collisionTolerance,
      shouldAvoidCollisions,
    });

    const context = React.useMemo(
      () => ({
        arrowRef,
        arrowStyles,
        setArrowOffset,
      }),
      [arrowStyles]
    );

    return (
      <div style={popperStyles}>
        <Comp {...interopDataAttrObj('root')} {...popperProps} ref={composedPopperRef}>
          <PopperContext.Provider value={context}>{children}</PopperContext.Provider>
        </Comp>
      </div>
    );
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
    <span style={arrowStyles}>
      <span
        // we use an extra wrapper because `useSize` doesn't play well with
        // the SVG arrow which is sized via CSS
        ref={arrowRef}
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        <Comp ref={forwardedRef} {...interopDataAttrObj('arrow')} {...arrowProps} />
      </span>
    </span>
  );
});

/* -----------------------------------------------------------------------------------------------*/

Popper.Arrow = PopperArrow;

Popper.displayName = POPPER_NAME;
Popper.Arrow.displayName = ARROW_NAME;

const [styles, interopDataAttrObj] = createStyleObj(POPPER_NAME, {
  root: {
    ...cssReset(POPPER_DEFAULT_TAG),
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
  },
});

export type { PopperProps, PopperArrowProps };
export { Popper, styles };
