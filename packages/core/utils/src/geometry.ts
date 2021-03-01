const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

type Axis = 'x' | 'y';

type Side = typeof SIDE_OPTIONS[number];

type Align = typeof ALIGN_OPTIONS[number];

type Point = { x: number; y: number };

type Size = { width: number; height: number };

/**
 * Creates a rect (`ClientRect`) based on a Size and and a position (x, y).
 * This is useful to compute the rect of an element without having to actually move it.
 */
function makeRect({ width, height }: Size, { x, y }: Point): ClientRect {
  return DOMRect.fromRect({ width, height, x, y });
}

/**
 * Creates a new rect (`ClientRect`) based on a given one but contracted by
 * a given amout on each side.
 */
function getContractedRect(rect: ClientRect, amount: number) {
  return makeRect(
    { width: rect.width - amount * 2, height: rect.height - amount * 2 },
    { x: rect.left + amount, y: rect.top + amount }
  );
}

/**
 * Gets the opposite side of a given side (ie. top => bottom, left => right, …)
 */
function getOppositeSide(side: Side): Side {
  const oppositeSides: Record<Side, Side> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  };
  return oppositeSides[side];
}

/**
 * Gets collisions for each side of a rect (top, right, bottom, left)
 */
function getCollisions(
  /** The rect to test collisions against */
  rect: ClientRect,
  /** The rect which represents the boundaries for collision checks */
  collisionBoundariesRect: ClientRect
) {
  return {
    top: rect.top < collisionBoundariesRect.top,
    right: rect.right > collisionBoundariesRect.right,
    bottom: rect.bottom > collisionBoundariesRect.bottom,
    left: rect.left < collisionBoundariesRect.left,
  };
}

export { SIDE_OPTIONS, ALIGN_OPTIONS, makeRect, getContractedRect, getOppositeSide, getCollisions };
export type { Axis, Side, Align, Point, Size };
