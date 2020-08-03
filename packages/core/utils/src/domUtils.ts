import kebabCase from 'lodash.kebabcase';
import { isFunction } from './typeUtils';

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

export function makeId(...args: (string | number | null | undefined)[]) {
  return args.filter((val) => val != null).join('-');
}

/**
 * Get a computed style value by property.
 *
 * @param element
 * @param styleProp
 */
export function getComputedStyleFromProperty(element: Element, styleProp: string) {
  let style: string | null = null;
  let doc = getOwnerDocument(element);
  if ((element as any).currentStyle) {
    style = (element as any).currentStyle[styleProp];
  } else if (doc && doc.defaultView && isFunction(doc.defaultView.getComputedStyle)) {
    style = doc.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
  }
  return style;
}
