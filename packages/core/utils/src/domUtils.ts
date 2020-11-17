const NAMESPACE = 'interop-ui';

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

export { getPartDataAttr, getPartDataAttrObj, canUseDOM, makeId };
