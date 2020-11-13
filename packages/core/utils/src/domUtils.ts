function camelToKebab(input: string) {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getPartDataAttr(componentPart: string) {
  return `data-interop-${camelToKebab(componentPart.replace('.', ''))}`;
}

function getPartDataAttrObj(componentPart: string) {
  return { [getPartDataAttr(componentPart)]: '' };
}

function getPartDataAttrSelector(componentPart: string) {
  return `[${getPartDataAttr(componentPart)}]`;
}

function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

function makeId(...args: (string | number | null | undefined)[]) {
  return args.filter((val) => val != null).join('-');
}

export { getPartDataAttr, getPartDataAttrObj, getPartDataAttrSelector, canUseDOM, makeId };
