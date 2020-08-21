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
