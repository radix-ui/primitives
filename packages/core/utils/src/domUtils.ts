import kebabCase from 'lodash.kebabcase';

export function interopDataAttr(componentPart: string) {
  return `data-interop-${kebabCase(componentPart)}`;
}

export function interopDataAttrObj(componentPart: string) {
  return { [interopDataAttr(componentPart)]: '' };
}

export function interopDataAttrSelector(componentPart: string) {
  return `[${interopDataAttr(componentPart)}]`;
}

export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export function makeId(...args: (string | number | null | undefined)[]) {
  return args.filter((val) => val != null).join('-');
}

export function isRightClick(event: MouseEvent | PointerEvent | TouchEvent) {
  return 'button' in event ? event.button === 2 : 'which' in event ? event.which === 3 : false;
}

export function getResizeObserverEntryBorderBoxSize(
  entry: ResizeObserverEntry
): ResizeObserverSize {
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

export function getResizeObserverEntryContentBoxSize(
  entry: ResizeObserverEntry
): ResizeObserverSize {
  if ('contentBoxSize' in entry) {
    return Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
  }

  return {
    inlineSize: (entry as ResizeObserverEntry).contentRect.width,
    blockSize: (entry as ResizeObserverEntry).contentRect.height,
  };
}
