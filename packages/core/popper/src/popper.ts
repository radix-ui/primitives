import * as CSS from 'csstype';
import {
  Axis,
  Side,
  Align,
  Point,
  makeRect,
  getOppositeSide,
  Size,
  getCollisions,
  Collisions,
} from '@interop-ui/utils';

type GetPlacementDataOptions = {
  /** The rect of the anchor we are placing around */
  anchorRect?: ClientRect;
  /** The size of the popper to place */
  popperSize?: Size;
  /** An optional arrow size */
  arrowSize?: Size;
  /** An optional arrow offset (along the side, default: 0) */
  arrowOffset?: number;
  /** The desired side */
  side: Side;
  /** An optional side offset (distance from the side, default: 0)  */
  sideOffset?: number;
  /** The desired alignment */
  align: Align;
  /** An optional alignment offset (distance along the side, default: 0) */
  alignOffset?: number;
  /** An option to turn on/off the collision handling (default: true) */
  shouldAvoidCollisions?: boolean;
  /** The tolerance used for collisions, ie. if we want them to trigger a bit earlier (default: 0) */
  collisionTolerance?: number;
};

type PlacementData = {
  popperStyles: CSS.Properties;
  arrowStyles: CSS.Properties;
  placedSide?: Side;
  placedAlign?: Align;
};

/**
 * Given all the information necessary to compute it,
 * this function calculates all the necessary placement data.
 *
 * It will return:
 *
 * - the styles to apply to the popper (including a custom property that is useful to set the transform origin in the right place)
 * - the styles to apply to the arrow
 * - the placed side (because it might have changed because of collisions)
 * - the placed align (because it might have changed because of collisions)
 */
export function getPlacementData({
  anchorRect,
  popperSize,
  arrowSize,
  arrowOffset = 0,
  side,
  sideOffset = 0,
  align,
  alignOffset = 0,
  shouldAvoidCollisions = true,
  collisionTolerance = 0,
}: GetPlacementDataOptions): PlacementData {
  // if we're not ready to do all the measurements yet,
  // we return some good default styles
  if (!anchorRect || !popperSize) {
    return {
      popperStyles: UNMEASURED_POPPER_STYLES,
      arrowStyles: UNMEASURED_ARROW_STYLES,
    };
  }

  // pre-compute points for all potential placements
  const allPlacementPoints = getAllPlacementPoints(
    popperSize,
    anchorRect,
    sideOffset,
    alignOffset,
    arrowSize
  );

  // get point based on side / align
  const popperPoint = allPlacementPoints[side][align];

  // if we don't need to avoid collisions, we can stop here
  if (shouldAvoidCollisions === false) {
    const popperStyles = getPlacementStylesForPoint(popperPoint);

    let arrowStyles = UNMEASURED_ARROW_STYLES;
    if (arrowSize) {
      arrowStyles = getPopperArrowStyles({ popperSize, arrowSize, arrowOffset, side, align });
    }

    const transformOrigin = getTransformOrigin(popperSize, side, align, arrowOffset, arrowSize);

    return {
      popperStyles: {
        ...popperStyles,
        ['--interop-ui-popper-transform-origin' as any]: transformOrigin,
      },
      arrowStyles,
      placedSide: side,
      placedAlign: align,
    };
  }

  // create a new rect as if element had been moved to new placement
  const popperRect = makeRect(popperSize, popperPoint);

  // check for any collisions in new placement
  const popperCollisions = getCollisions(popperRect, collisionTolerance);

  // do all the same calculations for the opposite side
  // this is because we need to check for potential collisions if we were to swap side
  const oppositeSide = getOppositeSide(side);
  const oppositeSidePopperPoint = allPlacementPoints[oppositeSide][align];
  const updatedOppositeSidePopperPoint = makeRect(popperSize, oppositeSidePopperPoint);
  const oppositeSidePopperCollisions = getCollisions(
    updatedOppositeSidePopperPoint,
    collisionTolerance
  );

  // adjust side accounting for collisions / opposite side collisions
  const placedSide = getSideAccountingForCollisions(
    side,
    popperCollisions,
    oppositeSidePopperCollisions
  );

  // adjust alignnment accounting for collisions
  const placedAlign = getAlignAccountingForCollisions(
    popperSize,
    anchorRect,
    side,
    align,
    popperCollisions
  );

  const placedPopperPoint = allPlacementPoints[placedSide][placedAlign];

  // compute adjusted popper / arrow styles
  const popperStyles = getPlacementStylesForPoint(placedPopperPoint);

  let arrowStyles = UNMEASURED_ARROW_STYLES;
  if (arrowSize) {
    arrowStyles = getPopperArrowStyles({
      popperSize,
      arrowSize,
      arrowOffset,
      side: placedSide,
      align: placedAlign,
    });
  }

  const transformOrigin = getTransformOrigin(
    popperSize,
    placedSide,
    placedAlign,
    arrowOffset,
    arrowSize
  );

  return {
    popperStyles: {
      ...popperStyles,
      ['--interop-ui-popper-transform-origin' as any]: transformOrigin,
    },
    arrowStyles,
    placedSide,
    placedAlign,
  };
}

type AllPlacementPoints = Record<Side, Record<Align, Point>>;

function getAllPlacementPoints(
  popperSize: Size,
  anchorRect: ClientRect,
  sideOffset: number = 0,
  alignOffset: number = 0,
  arrowSize?: Size
): AllPlacementPoints {
  const arrowBaseToTipLength = arrowSize ? arrowSize.height : 0;

  const x = getPopperSlotsForAxis(anchorRect, popperSize, 'x');
  const y = getPopperSlotsForAxis(anchorRect, popperSize, 'y');

  const topY    = y.before - sideOffset - arrowBaseToTipLength; // prettier-ignore
  const bottomY = y.after  + sideOffset + arrowBaseToTipLength; // prettier-ignore
  const leftX   = x.before - sideOffset - arrowBaseToTipLength; // prettier-ignore
  const rightX  = x.after  + sideOffset + arrowBaseToTipLength; // prettier-ignore

  // prettier-ignore
  const map: AllPlacementPoints = {
    top: {
      start:  { x: x.start + alignOffset, y: topY },
      center: { x: x.center,              y: topY },
      end:    { x: x.end - alignOffset,   y: topY },
    },
    right: {
      start:  { x: rightX, y: y.start + alignOffset },
      center: { x: rightX, y: y.center },
      end:    { x: rightX, y: y.end - alignOffset },
    },
    bottom: {
      start:  { x: x.start + alignOffset, y: bottomY },
      center: { x: x.center,              y: bottomY },
      end:    { x: x.end - alignOffset,   y: bottomY },
    },
    left: {
      start:  { x: leftX, y: y.start + alignOffset },
      center: { x: leftX, y: y.center },
      end:    { x: leftX, y: y.end - alignOffset },
    },
  };

  return map;
}

function getPopperSlotsForAxis(anchorRect: ClientRect, popperSize: Size, axis: Axis) {
  const startSide = axis === 'x' ? 'left' : 'top';
  const anchorStart = anchorRect[startSide];

  const dimension = axis === 'x' ? 'width' : 'height';
  const anchorDimension = anchorRect[dimension];
  const popperDimension = popperSize[dimension];

  // prettier-ignore
  return {
    before: anchorStart - popperDimension,
    start:  anchorStart,
    center: anchorStart + (anchorDimension - popperDimension) / 2,
    end:    anchorStart + anchorDimension - popperDimension,
    after:  anchorStart + anchorDimension,
  };
}

/**
 * Gets an adjusted side based on collision information
 */
export function getSideAccountingForCollisions(
  /** The side we want to ideally position to */
  side: Side,
  /** The collisions for this given side */
  collisions: Collisions,
  /** The collisions for the opposite side (if we were to swap side) */
  oppositeSideCollisions: Collisions
): Side {
  const oppositeSide = getOppositeSide(side);
  // in order to prevent premature jumps
  // we only swap side if there's enough space to fit on the opposite side
  return collisions[side] && !oppositeSideCollisions[oppositeSide] ? oppositeSide : side;
}

/**
 * Gets an adjusted alignment based on collision information
 */
export function getAlignAccountingForCollisions(
  /** The size of the popper to place */
  popperSize: Size,
  /** The size of the anchor we are placing around */
  anchorSize: Size,
  /** The final side */
  side: Side,
  /** The desired align */
  align: Align,
  /** The collisions */
  collisions: Collisions
): Align {
  const isHorizontalSide = side === 'top' || side === 'bottom';
  const startBound = isHorizontalSide ? 'left' : 'top';
  const endBound = isHorizontalSide ? 'right' : 'bottom';
  const dimension = isHorizontalSide ? 'width' : 'height';
  const isAnchorBigger = anchorSize[dimension] > popperSize[dimension];

  if (align === 'start' || align === 'center') {
    if ((collisions[startBound] && isAnchorBigger) || (collisions[endBound] && !isAnchorBigger)) {
      return 'end';
    }
  }

  if (align === 'end' || align === 'center') {
    if ((collisions[endBound] && isAnchorBigger) || (collisions[startBound] && !isAnchorBigger)) {
      return 'start';
    }
  }

  return align;
}

function getPlacementStylesForPoint(point: Point): CSS.Properties {
  const x = Math.round(point.x + window.scrollX);
  const y = Math.round(point.y + window.scrollY);
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    willChange: 'transform',
    transform: `translate3d(${x}px, ${y}px, 0)`,
  };
}

function getTransformOrigin(
  popperSize: Size,
  side: Side,
  align: Align,
  arrowOffset: number,
  arrowSize?: Size
): CSS.Properties['transformOrigin'] {
  const isHorizontalSide = side === 'top' || side === 'bottom';

  const arrowBaseLength = arrowSize ? arrowSize.width : 0;
  const arrowBaseToTipLength = arrowSize ? arrowSize.height : 0;
  const sideOffset = arrowBaseToTipLength;
  const alignOffset = arrowBaseLength / 2 + arrowOffset;

  let x = '';
  let y = '';

  if (isHorizontalSide) {
    x = {
      start: `${alignOffset}px`,
      center: 'center',
      end: `${popperSize.width - alignOffset}px`,
    }[align];

    y = side === 'top' ? `${popperSize.height + sideOffset}px` : `${-sideOffset}px`;
  } else {
    x = side === 'left' ? `${popperSize.width + sideOffset}px` : `${-sideOffset}px`;

    y = {
      start: `${alignOffset}px`,
      center: 'center',
      end: `${popperSize.height - alignOffset}px`,
    }[align];
  }

  return `${x} ${y}`;
}

const UNMEASURED_POPPER_STYLES: CSS.Properties = {
  // position: 'fixed' here is important because it will take the popper
  // out of the flow so it does not disturb the position of the anchor
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
};

const UNMEASURED_ARROW_STYLES: CSS.Properties = {
  // given the arrow is nested inside the popper,
  // make sure that it is out of the flow and doesn't hinder then popper's measurement
  position: 'absolute',
  opacity: 0,
};

type GetArrowStylesOptions = {
  /** The size of the popper to place */
  popperSize: Size;
  /** The size of the arrow itself */
  arrowSize: Size;
  /** An offset for the arrow along the align axis */
  arrowOffset: number;
  /** The side where the arrow points to */
  side: Side;
  /** The alignment of the arrow along the side */
  align: Align;
};

/**
 * Computes the styles necessary to position, rotate and align the arrow correctly.
 * It can adjust itself based on anchor/popper size, side/align and an optional offset.
 */
function getPopperArrowStyles({
  popperSize,
  arrowSize,
  arrowOffset,
  side,
  align,
}: GetArrowStylesOptions): CSS.Properties {
  const popperCenterX = (popperSize.width - arrowSize.width) / 2;
  const popperCenterY = (popperSize.height - arrowSize.width) / 2;

  const rotationMap = { top: 0, right: 90, bottom: 180, left: -90 };
  const rotation = rotationMap[side];
  const arrowMaxDimension = Math.max(arrowSize.width, arrowSize.height);

  const styles: CSS.Properties = {
    // we make sure we put the arrow inside a 1:1 ratio container
    // this is to make the rotation handling simpler
    // as we do no need to worry about changing the transform-origin
    width: `${arrowMaxDimension}px`,
    height: `${arrowMaxDimension}px`,

    // rotate the arrow appropriately
    transform: `rotate(${rotation}deg)`,
    willChange: 'transform',

    // position the arrow appropriately
    position: 'absolute',
    [side]: '100%',

    // Because the arrow gets rotated (see `transform above`)
    // and we are putting it inside a 1:1 ratio container
    // we need to adjust the CSS direction from `ltr` to `rtl`
    // in some circumstances
    direction: getArrowCssDirection(side, align),
  };

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') {
      styles.left = `${arrowOffset}px`;
    }
    if (align === 'center') {
      styles.left = `${popperCenterX}px`;
    }
    if (align === 'end') {
      styles.right = `${arrowOffset}px`;
    }
  }

  if (side === 'left' || side === 'right') {
    if (align === 'start') {
      styles.top = `${arrowOffset}px`;
    }
    if (align === 'center') {
      styles.top = `${popperCenterY}px`;
    }
    if (align === 'end') {
      styles.bottom = `${arrowOffset}px`;
    }
  }

  return styles;
}

/**
 * Adjusts the arrow's CSS direction (`ltr` / `rtl`)
 */
function getArrowCssDirection(side: Side, align: Align): CSS.Property.Direction {
  if ((side === 'top' || side === 'right') && align === 'end') {
    return 'rtl';
  }

  if ((side === 'bottom' || side === 'left') && align !== 'end') {
    return 'rtl';
  }

  return 'ltr';
}
