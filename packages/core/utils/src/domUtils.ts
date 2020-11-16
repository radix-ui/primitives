/** Possible inputs: "Component", "SomeComponent", "Component.Part", "SomeComponent.Part", "SomeComponent.SomePart" */
function getPartDataAttr(componentPart: string) {
  const part = componentPart
    .replace('.', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `data-interop-${part}`;
}

/** Possible inputs: "Component", "SomeComponent", "Component.Part", "SomeComponent.Part", "SomeComponent.SomePart" */
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
