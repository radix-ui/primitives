import { getPartDataAttrObj, getPartDataAttrSelector } from '@interop-ui/utils';

type StyleObject = {};
type PrimitiveStyles<Part extends string> = {
  root: StyleObject;
} & Record<Part, StyleObject>;

export function createStyleObj<Part extends string = string>(
  namespace: string,
  stylesInput: PrimitiveStyles<Part>
): [PrimitiveStyles<Part>, (part: Part) => ReturnType<typeof getPartDataAttrObj>] {
  let stylesOutput = stylesInput;

  if (process.env.EXTRACT_CSS) {
    stylesOutput = Object.keys(stylesInput).reduce((acc, part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return {
        ...acc,
        [getPartDataAttrSelector(namespacedPart)]: stylesInput[part as Part],
      };
    }, {} as PrimitiveStyles<string>);
  }

  return [
    stylesOutput,
    (part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return getPartDataAttrObj(namespacedPart);
    },
  ];
}

export function getNamespacedPart(namespace: string, part: string) {
  return part === 'root' ? namespace : namespace + capitalize(part);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
