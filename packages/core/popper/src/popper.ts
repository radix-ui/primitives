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
  /** The rect of the target we are placing around */
  targetRect?: ClientRect;
  /** The size of the popper to place */
  popperSize?: Size;
  /** An optional arrow size */
  arrowSize?: Size;
  /** An optional arrow offset (along the side, default: 20) */
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
  transformOriginStyles: CSS.Properties;
  adjustedSide: Side;
  adjustedAlign: Align;
};

/**
 * Given all the information necessary to compute it,
 * this function calculates all the necessary placement data.
 *
 * It will return:
 *
 * - the styles to apply to the popper
 * - the styles to apply to the arrow
 * - some styles that could be useful to set the transform origin in the right place
 * - the adjusted side (because it might have changed because of collisions)
 * - the adjusted align (because it might have changed because of collisions)
 */
export function getPlacementData({
  targetRect,
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
  if (!targetRect || !popperSize) {
    return {
      // position: 'fixed' here is important because it will take the popper
      // out of the flow so it does not disturb the position of the target
      popperStyles: {
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0,
        pointerEvents: 'none',
      },
      arrowStyles: { opacity: 0 },
      transformOriginStyles: {},
      adjustedSide: side,
      adjustedAlign: align,
    };
  }

  // pre-compute points for all potential placements
  const allPlacementPoints = getAllPlacementPoints(
    popperSize,
    targetRect,
    sideOffset,
    alignOffset,
    arrowSize
  );

  // get point based on side / align
  const popperPoint = allPlacementPoints[side][align];

  // if we don't need to avoid collisions, we can stop here
  if (shouldAvoidCollisions === false) {
    const popperStyles = getPlacementStylesForPoint(popperPoint);

    let arrowStyles = {};
    if (arrowSize) {
      arrowStyles = getPopperArrowStyles({ popperSize, arrowSize, arrowOffset, side, align });
    }

    const transformOriginStyles = getTransformOriginStyles(
      popperSize,
      side,
      align,
      arrowOffset,
      arrowSize
    );

    return {
      popperStyles,
      arrowStyles,
      transformOriginStyles,
      adjustedSide: side,
      adjustedAlign: align,
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
  const adjustedSide = getSideAccountingForCollisions(
    side,
    popperCollisions,
    oppositeSidePopperCollisions
  );

  // adjust alignnment accounting for collisions
  const adjustedAlign = getAlignAccountingForCollisions(
    popperSize,
    targetRect,
    side,
    align,
    popperCollisions
  );

  const adjustedPopperPoint = allPlacementPoints[adjustedSide][adjustedAlign];

  // compute adjusted popper / arrow / transform origin styles
  const popperStyles = getPlacementStylesForPoint(adjustedPopperPoint);

  let arrowStyles = {};
  if (arrowSize) {
    arrowStyles = getPopperArrowStyles({
      popperSize,
      arrowSize,
      arrowOffset,
      side: adjustedSide,
      align: adjustedAlign,
    });
  }

  const transformOriginStyles = getTransformOriginStyles(
    popperSize,
    adjustedSide,
    adjustedAlign,
    arrowOffset,
    arrowSize
  );

  return {
    popperStyles,
    arrowStyles,
    transformOriginStyles,
    adjustedSide,
    adjustedAlign,
  };
}

type AllPlacementPoints = Record<Side, Record<Align, Point>>;

function getAllPlacementPoints(
  popperSize: Size,
  targetRect: ClientRect,
  sideOffset: number = 0,
  alignOffset: number = 0,
  arrowSize?: Size
): AllPlacementPoints {
  const arrowBaseToTipLength = arrowSize ? arrowSize.height : 0;

  const x = getPopperSlotsForAxis(targetRect, popperSize, 'x');
  const y = getPopperSlotsForAxis(targetRect, popperSize, 'y');

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

function getPopperSlotsForAxis(targetRect: ClientRect, popperSize: Size, axis: Axis) {
  const startSide = axis === 'x' ? 'left' : 'top';
  const targetStart = targetRect[startSide];

  const dimension = axis === 'x' ? 'width' : 'height';
  const targetDimension = targetRect[dimension];
  const popperDimension = popperSize[dimension];

  // prettier-ignore
  return {
    before: targetStart - popperDimension,
    start:  targetStart,
    center: targetStart + (targetDimension - popperDimension) / 2,
    end:    targetStart + targetDimension - popperDimension,
    after:  targetStart + targetDimension,
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
  /** The size of the target we are placing around */
  targetSize: Size,
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
  const isTargetBigger = targetSize[dimension] > popperSize[dimension];

  if (align === 'start' || align === 'center') {
    if ((collisions[startBound] && isTargetBigger) || (collisions[endBound] && !isTargetBigger)) {
      return 'end';
    }
  }

  if (align === 'end' || align === 'center') {
    if ((collisions[endBound] && isTargetBigger) || (collisions[startBound] && !isTargetBigger)) {
      return 'start';
    }
  }

  return align;
}

function getPlacementStylesForPoint(point: Point): CSS.Properties {
  const x = Math.round(point.x + window.pageXOffset);
  const y = Math.round(point.y + window.pageYOffset);
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    willChange: 'transform',
    transform: `translate3d(${x}px, ${y}px, 0)`,
  };
}

function getTransformOriginStyles(
  popperSize: Size,
  side: Side,
  align: Align,
  arrowOffset: number,
  arrowSize?: Size
): CSS.Properties {
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

  return {
    transformOrigin: `${x} ${y}`,
  };
}

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
 * It can adjust itself based on target/popper size, side/align and an optional offset.
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
function getArrowCssDirection(side: Side, align: Align): CSS.DirectionProperty {
  if ((side === 'top' || side === 'right') && align === 'end') {
    return 'rtl';
  }

  if ((side === 'bottom' || side === 'left') && align !== 'end') {
    return 'rtl';
  }

  return 'ltr';
}
