import kebabCase from 'lodash.kebabcase';

export function interopDataAttr(componentPart: string) {
  return `data-interop-part-${kebabCase(componentPart)}`;
}

export function interopDataAttrObj(componentPart: string) {
  return { [interopDataAttr(componentPart)]: '' };
}
