import { getSideAccountingForCollisions, getAlignAccountingForCollisions } from './popper';
import { Collisions, SIDE_OPTIONS, Align, Size } from '@interop-ui/utils';

const COLLISION_NONE: Collisions = { top: false, right: false, bottom: false, left: false };
const COLLISION_TOP: Collisions = { top: true, right: false, bottom: false, left: false };
const COLLISION_RIGHT: Collisions = { top: false, right: true, bottom: false, left: false };
const COLLISION_BOTTOM: Collisions = { top: false, right: false, bottom: true, left: false };
const COLLISION_LEFT: Collisions = { top: false, right: false, bottom: false, left: true };
const SIZE_SMALL: Size = { width: 50, height: 50 };
const SIZE_BIG: Size = { width: 100, height: 100 };

describe('getSideAccountingForCollisions', () => {
  it('flips side to opposite if there is not enough space to fit on the desired side', () => {
    expect(getSideAccountingForCollisions('top', COLLISION_TOP, COLLISION_NONE)).toBe('bottom');
    expect(getSideAccountingForCollisions('left', COLLISION_LEFT, COLLISION_NONE)).toBe('right');
    expect(getSideAccountingForCollisions('bottom', COLLISION_BOTTOM, COLLISION_NONE)).toBe('top');
    expect(getSideAccountingForCollisions('right', COLLISION_RIGHT, COLLISION_NONE)).toBe('left');
  });

  it('does not flip side to opposite side if there is not enough space yet on the opposite side', () => {
    expect(getSideAccountingForCollisions('top', COLLISION_TOP, COLLISION_BOTTOM)).toBe('top');
    expect(getSideAccountingForCollisions('left', COLLISION_LEFT, COLLISION_RIGHT)).toBe('left');
    expect(getSideAccountingForCollisions('bottom', COLLISION_BOTTOM, COLLISION_TOP)).toBe(
      'bottom'
    );
    expect(getSideAccountingForCollisions('right', COLLISION_RIGHT, COLLISION_LEFT)).toBe('right');
  });
});

describe('getAlignAccountingForCollisions', () => {
  const START_CENTER_ALIGNS: Align[] = ['start', 'center'];
  const END_CENTER_ALIGNS: Align[] = ['end', 'center'];

  SIDE_OPTIONS.forEach((side) => {
    const isHorizontalSide = side === 'top' || side === 'bottom';
    const startBound = isHorizontalSide ? 'left' : 'top';
    const endBound = isHorizontalSide ? 'right' : 'bottom';
    const START_BOUND_COLLISION = isHorizontalSide ? COLLISION_LEFT : COLLISION_TOP;
    const END_BOUND_COLLISION = isHorizontalSide ? COLLISION_RIGHT : COLLISION_BOTTOM;

    describe('when the popper is smaller than the target along the side', () => {
      // for each sides
      describe(`on the ${side}`, () => {
        // for `start` and `center` align
        START_CENTER_ALIGNS.forEach((align) => {
          it(`'${align}' => 'end' if it does not fit on the '${startBound}'`, () => {
            expect(
              getAlignAccountingForCollisions(
                SIZE_SMALL,
                SIZE_BIG,
                side,
                align,
                START_BOUND_COLLISION
              )
            ).toBe('end');
          });
        });

        // for `end` and `center` align
        END_CENTER_ALIGNS.forEach((align) => {
          it(`'${align}' => 'start' if it does not fit on the '${endBound}'`, () => {
            expect(
              getAlignAccountingForCollisions(
                SIZE_SMALL,
                SIZE_BIG,
                side,
                align,
                END_BOUND_COLLISION
              )
            ).toBe('start');
          });
        });
      });
    });

    describe('when the popper is bigger than the target along the side', () => {
      // for each sides
      describe(`side: ${side}`, () => {
        // for `start` and `center` align
        START_CENTER_ALIGNS.forEach((align) => {
          it(`'${align}' => 'end' if it does not fit on the '${endBound}'`, () => {
            expect(
              getAlignAccountingForCollisions(
                SIZE_BIG,
                SIZE_SMALL,
                side,
                align,
                END_BOUND_COLLISION
              )
            ).toBe('end');
          });
        });

        // for `end` and `center` align
        END_CENTER_ALIGNS.forEach((align) => {
          it(`'${align}' => 'start' if it does not fit on the '${startBound}'`, () => {
            expect(
              getAlignAccountingForCollisions(
                SIZE_BIG,
                SIZE_SMALL,
                side,
                align,
                START_BOUND_COLLISION
              )
            ).toBe('start');
          });
        });
      });
    });
  });
});
