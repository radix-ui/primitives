import React from 'react';
import { forwardRef, useRect, useComposedRefs, PrimitiveStyles } from '@interop-ui/react-utils';
import { useSize } from '@interop-ui/react-use-size';
import { Portal } from '@interop-ui/react-portal';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { cssReset, Side, Align, isFunction, interopDataAttrObj } from '@interop-ui/utils';
import { getPlacementData } from '@interop-ui/popper';
import { Arrow } from '@interop-ui/react-arrow';
import * as CSS from 'csstype';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const PopoverArrowContext = React.createContext<{
  arrowStyles: React.CSSProperties;
  arrowRef: React.RefObject<HTMLElement | null>;
}>({ arrowStyles: {}, arrowRef: { current: null } });
PopoverArrowContext.displayName = 'PopoverArrowContext';

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_DEFAULT_TAG = 'div';

type PopoverDOMProps = React.ComponentPropsWithRef<typeof POPOVER_DEFAULT_TAG>;
type PopoverOwnProps = {
  targetRef: React.RefObject<HTMLElement | SVGElement>;

  /** whether the Popover is currently opened or not */
  isOpen: boolean;

  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  arrowOffset?: number;
  collisionTolerance?: number;

  /**
   * By default the popover will only render when open. Some components using popover may work
   * better by hiding the popover visually using CSS rather than conditionally rendering, so this
   * prop povides an opt-out for those cases.
   * (default: `true`)
   */
  renderOnlyWhileOpen?: boolean;

  /**
   * Whether or not to portal the contents of the popover.
   * (default: `true`)
   */
  shouldPortal?: boolean;
  positionOverride?(props: {
    targetRect: ClientRect | undefined;
    popperRect: ClientRect | undefined;
  }): CSS.Properties;
};
type PopoverProps = PopoverDOMProps & PopoverOwnProps;

const Popover = forwardRef<typeof POPOVER_DEFAULT_TAG, PopoverProps, PopoverStaticProps>(
  function Popover(props, forwardedRef) {
    const {
      as: Comp = POPOVER_DEFAULT_TAG,
      align = 'center',
      alignOffset = 0,
      arrowOffset = 10,
      children,
      collisionTolerance = 0,
      isOpen,
      positionOverride,
      renderOnlyWhileOpen = true,
      shouldPortal = true,
      side = 'bottom',
      sideOffset = -5,
      style,
      targetRef,
      ...contentProps
    } = props;

    let debugContext = useDebugContext();

    let shouldRender = renderOnlyWhileOpen ? isOpen : true;

    let popperRef = React.useRef<HTMLDivElement>(null);
    let arrowRef = React.useRef<HTMLSpanElement>(null);
    let targetRect = useRect({ refToObserve: targetRef, isObserving: isOpen });
    let popperRect = useRect({ refToObserve: popperRef, isObserving: isOpen });
    let arrowSize = useSize({ refToObserve: arrowRef, isObserving: isOpen });

    let popperSize =
      popperRect?.height && popperRect?.width
        ? { height: popperRect.height, width: popperRect.width }
        : undefined;

    let shouldUseOverride = isFunction(positionOverride);

    let popperStyles: CSS.Properties = {};
    let arrowStyles: CSS.Properties = {};
    if (shouldUseOverride) {
      popperStyles = positionOverride!({ targetRect, popperRect });
    } else {
      let placementData = getPlacementData({
        popperSize,
        targetRect,
        arrowSize,
        arrowOffset,
        side,
        sideOffset,
        align,
        alignOffset,
        collisionTolerance,
        shouldAvoidCollisions: !debugContext.disableCollisionChecking,
      });

      popperStyles = placementData.popperStyles;
      arrowStyles = placementData.arrowStyles;
    }

    let Wrapper = shouldPortal ? Portal : React.Fragment;

    return (
      <PopoverArrowContext.Provider value={{ arrowStyles, arrowRef }}>
        {shouldRender ? (
          <Wrapper>
            <Comp
              ref={forwardedRef}
              style={{
                ...popperStyles,
                ...style,
              }}
              {...interopDataAttrObj('Popover')}
              {...contentProps}
            >
              {/*
              We put the `popperRef` on a div around the content and not on the content element
              itself. This is because the size measured by `useSize` doesn't account for
              padding/border (ResizeObserver limitations) so there would be some calculations issues
              if padding/border styles are passed to `<Content />` via CSS.

              See: https://github.com/que-etc/resize-observer-polyfill/issues/11
            */}
              <div ref={popperRef}>{children}</div>
            </Comp>
          </Wrapper>
        ) : null}
      </PopoverArrowContext.Provider>
    );
  }
);

Popover.displayName = 'Popover';

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_DEFAULT_TAG = 'span';

type PopoverArrowDOMProps = React.ComponentPropsWithRef<typeof ARROW_DEFAULT_TAG>;
type PopoverArrowOwnProps = {
  arrowElement?: React.ReactElement<any>;
};
type PopoverArrowProps = PopoverArrowDOMProps & PopoverArrowOwnProps;

const PopoverArrow = forwardRef<typeof ARROW_DEFAULT_TAG, PopoverArrowProps>(function PopoverArrow(
  props,
  forwardedRef
) {
  let { as: Comp = ARROW_DEFAULT_TAG, arrowElement, style, children, ...otherProps } = props;
  let { arrowStyles, arrowRef } = React.useContext(PopoverArrowContext);
  let ref = useComposedRefs(forwardedRef, arrowRef);
  return (
    <Comp
      style={{
        ...arrowStyles,
        ...style,
      }}
      {...interopDataAttrObj('PopoverArrow')}
      {...otherProps}
    >
      <span
        // we use an extra wrapper because `useSize` doesn't play well with
        // the SVG arrow which is sized via CSS
        ref={ref}
      >
        {arrowElement || <Arrow />}
      </span>
    </Comp>
  );
});

PopoverArrow.displayName = 'Popover.Arrow';

/* -----------------------------------------------------------------------------------------------*/

Popover.Arrow = PopoverArrow;

const styles: PrimitiveStyles = {
  popover: {
    ...cssReset(POPOVER_DEFAULT_TAG),
    position: 'absolute',
  },
  arrow: {
    ...cssReset(ARROW_DEFAULT_TAG),
    display: 'inline-block',
    verticalAlign: 'top',
  },
};

export { Popover, styles };
export type { PopoverProps, PopoverArrowProps };

interface PopoverStaticProps {
  Arrow: typeof PopoverArrow;
}
