// Fork of https://github.com/theKashey/react-remove-scroll-bar
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import { styleSingleton } from '../react-style-singleton/index.js';
import {
  fullWidthClassName,
  zeroRightClassName,
  noScrollbarsClassName,
  removedBarSizeVariable,
} from './constants.js';
import type { GapMode, GapOffset } from './utils.js';
import { getGapWidth } from './utils.js';

export interface BodyScroll {
  noRelative?: boolean;
  noImportant?: boolean;
  gapMode?: GapMode;
}

const Style = styleSingleton();

export const lockAttribute = 'data-scroll-locked';

// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
const getStyles = (
  { left, top, right, gap }: GapOffset,
  allowRelative: boolean,
  gapMode: GapMode = 'margin',
  important: string,
) => `
  .${noScrollbarsClassName} {
   overflow: hidden ${important};
   padding-right: ${gap}px ${important};
  }
  body[${lockAttribute}] {
    overflow: hidden ${important};
    overscroll-behavior: contain;
    ${[
      allowRelative && `position: relative ${important};`,
      gapMode === 'margin' &&
        `
    padding-left: ${left}px;
    padding-top: ${top}px;
    padding-right: ${right}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${gap}px ${important};
    `,
      gapMode === 'padding' && `padding-right: ${gap}px ${important};`,
    ]
      .filter(Boolean)
      .join('')}
  }

  .${zeroRightClassName} {
    right: ${gap}px ${important};
  }

  .${fullWidthClassName} {
    margin-right: ${gap}px ${important};
  }

  .${zeroRightClassName} .${zeroRightClassName} {
    right: 0 ${important};
  }

  .${fullWidthClassName} .${fullWidthClassName} {
    margin-right: 0 ${important};
  }

  body[${lockAttribute}] {
    ${removedBarSizeVariable}: ${gap}px;
  }
`;

const getCurrentUseCounter = () => {
  const counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);

  return isFinite(counter) ? counter : 0;
};

export const useLockAttribute = () => {
  React.useEffect(() => {
    document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());

    return () => {
      const newCounter = getCurrentUseCounter() - 1;

      if (newCounter <= 0) {
        document.body.removeAttribute(lockAttribute);
      } else {
        document.body.setAttribute(lockAttribute, newCounter.toString());
      }
    };
  }, []);
};

/**
 * Removes page scrollbar and blocks page scroll when mounted
 */
export const RemoveScrollBar: React.FC<BodyScroll> = ({
  noRelative,
  noImportant,
  gapMode = 'margin',
}) => {
  useLockAttribute();

  /*
   gap will be measured on every component mount
   however it will be used only by the "first" invocation
   due to singleton nature of <Style
   */
  const gap = React.useMemo(() => getGapWidth(gapMode), [gapMode]);

  return <Style styles={getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '')} />;
};

export { RemoveScrollBar as Root };
