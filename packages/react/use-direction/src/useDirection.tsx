import * as React from 'react';

type Direction = 'ltr' | 'rtl';

export function useDirection(element: HTMLElement | null, directionProp?: Direction) {
  const [direction, setDirection] = React.useState<Direction>('ltr');
  const [computedStyle, setComputedStyle] = React.useState<CSSStyleDeclaration>();
  const rAFRef = React.useRef<number>(0);

  React.useEffect(() => {
    // We check inherited direction of parent instead of `element` so that computed styles are
    // not overridden by dir attribute on element if inherited direction changes. The `dir`
    // attribute should always sync with direction prop OR its inherited direction.
    if (directionProp === undefined && element?.parentElement) {
      const computedStyle = getComputedStyle(element.parentElement);
      setComputedStyle(computedStyle);
    }
  }, [element, directionProp]);

  React.useEffect(() => {
    function getDirection() {
      rAFRef.current = requestAnimationFrame(() => {
        const dir = computedStyle?.direction as Direction | '' | undefined;
        if (dir) setDirection(dir);
        getDirection();
      });
    }

    if (directionProp === undefined) getDirection();
    return () => cancelAnimationFrame(rAFRef.current);
  }, [computedStyle, directionProp, setDirection]);

  return directionProp || direction;
}
