import kebabCase from 'lodash.kebabcase';

export function interopDataAttr(componentPart: string) {
  return `data-interop-part-${kebabCase(componentPart)}`;
}

export function interopDataAttrObj(componentPart: string) {
  return { [interopDataAttr(componentPart)]: '' };
}

/**
 * Get an element's owner document. Useful when components are used in iframes
 * or other environments like dev tools.
 *
 * @param element
 */
export function getOwnerDocument<T extends Element = HTMLElement>(element: T | null) {
  return element && element.ownerDocument ? element.ownerDocument : canUseDOM() ? document : null;
}

export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
