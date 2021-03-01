import React from 'react';
import { useRect, useSize } from '@radix-ui/react-utils';
import { getPlacementData, SIDE_OPTIONS, ALIGN_OPTIONS } from './popper';

export default { title: 'Core/popper' };

export function Position() {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
    >
      <Demo disableCollisions />
    </div>
  );
}

export function Collisions() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200vw',
        height: '200vh',
      }}
    >
      <Demo />
    </div>
  );
}

function Demo({ disableCollisions = false }) {
  const [sideIndex, setSideIndex] = React.useState(1);
  const [alignIndex, setAlignIndex] = React.useState(0);
  const [sideOffset, setSideOffset] = React.useState(5);
  const [alignOffset, setAlignOffset] = React.useState(0);
  const [arrowOffset, setArrowOffset] = React.useState(20);
  const [collisionTolerance, setCollisionTolerance] = React.useState(0);

  const side = SIDE_OPTIONS[sideIndex];
  const align = ALIGN_OPTIONS[alignIndex];

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const anchorRect = useRect(anchorRef);

  const popperRef = React.useRef<HTMLDivElement>(null);
  const popperSize = useSize(popperRef);

  const arrowRef = React.useRef<HTMLDivElement>(null);
  const arrowSize = useSize(arrowRef);

  const { popperStyles, arrowStyles } = getPlacementData({
    popperSize,
    anchorRect,
    arrowSize,
    arrowOffset,
    side,
    sideOffset,
    align,
    alignOffset,
    shouldAvoidCollisions: !disableCollisions,
    collisionBoundariesRect: DOMRect.fromRect({
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
    }),
    collisionTolerance,
  });

  return (
    <>
      <div
        ref={anchorRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 100,
          height: 100,
          backgroundColor: '#ccc',
        }}
      >
        Anchor
      </div>

      <div style={popperStyles}>
        <div
          ref={popperRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 180,
            height: 180,
            backgroundColor: 'hotpink',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 10 }}>
              side
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select
                value={sideIndex}
                onChange={(event) => setSideIndex(Number(event.target.value))}
                style={{ marginBottom: 10 }}
              >
                {SIDE_OPTIONS.map((side, index) => (
                  <option key={side} value={index}>
                    {side}
                  </option>
                ))}
              </select>
              align
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select
                value={alignIndex}
                onChange={(event) => setAlignIndex(Number(event.target.value))}
                style={{ marginBottom: 10 }}
              >
                {ALIGN_OPTIONS.map((align, index) => (
                  <option key={align} value={index}>
                    {align}
                  </option>
                ))}
              </select>
              arrowOffset
              <input
                type="number"
                min="-50"
                max="50"
                step="1"
                value={arrowOffset}
                onChange={(event) => setArrowOffset(Number(event.target.value))}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              offset
              <input
                type="number"
                min="-20"
                max="20"
                step="1"
                value={sideOffset}
                onChange={(event) => setSideOffset(Number(event.target.value))}
                style={{ marginBottom: 10 }}
              />
              offset
              <input
                type="number"
                min="-20"
                max="20"
                step="1"
                value={alignOffset}
                onChange={(event) => setAlignOffset(Number(event.target.value))}
                style={{ marginBottom: 10 }}
              />
              tolerance
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={collisionTolerance}
                onChange={(event) => setCollisionTolerance(Number(event.target.value))}
              />
            </div>
          </div>
        </div>

        <span style={arrowStyles}>
          <div
            ref={arrowRef}
            style={{
              width: 20,
              height: 10,
              borderBottomLeftRadius: 9999,
              borderBottomRightRadius: 9999,
              backgroundColor: 'hotpink',
            }}
          />
        </span>
      </div>
    </>
  );
}
