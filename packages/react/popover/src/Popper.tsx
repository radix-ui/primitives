import * as React from 'react';
import { getPlacementData } from '@interop-ui/popper';
import { useRect } from '@interop-ui/react-utils';
import { useSize } from '@interop-ui/react-use-size';

const PopperContext = React.createContext<{
  anchorRef: React.RefObject<HTMLElement>;
  contentRef: React.RefObject<HTMLElement>;
  setContentRef: (ref: React.RefObject<HTMLElement>) => void;
  contentPlacementStyles: React.CSSProperties;
  arrowRef: React.RefObject<HTMLElement>;
  setArrowRef: (ref: React.RefObject<HTMLElement>) => void;
  arrowPlacementStyles: React.CSSProperties;
}>({} as any);
PopperContext.displayName = 'PopperContext';

const NULL_REF = { current: null };

export function Popper({ children }) {
  const [contentRef, setContentRef] = React.useState<React.RefObject<HTMLElement>>(NULL_REF);
  const contentSize = useSize({ refToObserve: contentRef, isObserving: true });

  const [arrowRef, setArrowRef] = React.useState<React.RefObject<HTMLElement>>(NULL_REF);
  const arrowSize = useSize({ refToObserve: arrowRef, isObserving: true });

  const anchorRef = React.useRef<HTMLElement>(null);
  const anchorRect = useRect({
    refToObserve: contentRef.current !== null ? anchorRef : NULL_REF,
    isObserving: true,
  });

  const {
    popperStyles: contentPlacementStyles,
    arrowStyles: arrowPlacementStyles,
  } = getPlacementData({
    targetRect: anchorRect,
    popperSize: contentSize,
    arrowSize,
    arrowOffset: 0,
    side: 'bottom',
    sideOffset: -10,
    align: 'center',
    alignOffset: 0,
    collisionTolerance: 0,
    shouldAvoidCollisions: true, // !debugContext.disableCollisionChecking,
  });

  return (
    <PopperContext.Provider
      value={{
        anchorRef,
        contentRef,
        setContentRef,
        contentPlacementStyles,
        arrowRef,
        setArrowRef,
        arrowPlacementStyles,
      }}
    >
      {children}
    </PopperContext.Provider>
  );
}

function PopperAnchor({ children }: { children: React.ReactNode }) {
  const { anchorRef } = React.useContext(PopperContext);
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref: anchorRef,
  });
}

function PopperContent({ children }: { children: React.ReactNode }) {
  const { setContentRef, contentPlacementStyles } = React.useContext(PopperContext);
  const child = React.Children.only(children);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setContentRef(ref);
    return () => setContentRef(NULL_REF);
  }, [setContentRef]);

  return (
    <div style={contentPlacementStyles}>
      <div ref={ref}>{child}</div>
    </div>
  );
}

function PopperArrow({ children }: { children: React.ReactNode }) {
  const { setArrowRef, arrowPlacementStyles } = React.useContext(PopperContext);
  const child = React.Children.only(children);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setArrowRef(ref);
    return () => setArrowRef(NULL_REF);
  }, [setArrowRef]);

  return (
    <span style={arrowPlacementStyles}>
      <span
        ref={ref}
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        {child}
      </span>
    </span>
  );
}

Popper.Anchor = PopperAnchor;
Popper.Content = PopperContent;
Popper.Arrow = PopperArrow;
