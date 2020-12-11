/// <reference types="resize-observer-browser" />

const NAMESPACE = 'radix';

function namespaced(componentPart: string) {
  const part = componentPart
    .replace('.', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `${NAMESPACE}-${part}`;
}

function getPartDataAttr(componentPart: string) {
  return `data-${namespaced(componentPart)}`;
}

function getPartDataAttrObj(componentPart: string) {
  return { [getPartDataAttr(componentPart)]: '' };
}

function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

function makeId(...args: (string | number | null | undefined)[]) {
  return args.filter((val) => val != null).join('-');
}

function isMainClick(event: MouseEvent | PointerEvent) {
  return event.button === 0;
}

function getResizeObserverEntryBorderBoxSize(entry: ResizeObserverEntry): ResizeObserverSize {
  if ('borderBoxSize' in entry) {
    return Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
  }

  // for browsers that don't support `borderBoxSize` we calculate a rect ourselves to get the
  // correct border box.
  const rect = (entry as ResizeObserverEntry).target.getBoundingClientRect();
  return {
    inlineSize: rect.width,
    blockSize: rect.height,
  };
}

export {
  getPartDataAttr,
  getPartDataAttrObj,
  canUseDOM,
  makeId,
  namespaced,
  isMainClick,
  getResizeObserverEntryBorderBoxSize,
};
