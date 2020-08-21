import * as React from 'react';
import { interopDataAttrObj, interopDataAttrSelector, isFunction } from '@interop-ui/utils';

type StyleObject = React.CSSProperties | Record<string, React.CSSProperties>;
type Selector = ReturnType<typeof interopDataAttrSelector>;
type PrimitiveStyles<Part extends string> = {
  root: StyleObject;
} & Record<Part, StyleObject>;

export function createStyleObj<Part extends string = string>(
  namespace: string,
  originalStyles:
    | ((selector: (part: string) => Selector) => PrimitiveStyles<Part>)
    | PrimitiveStyles<Part>
): [PrimitiveStyles<Part>, (part: Part) => ReturnType<typeof interopDataAttrObj>] {
  const selector = (part: string) => {
    const namespacedPart = getNamespacedPart(namespace, part);
    return interopDataAttrSelector(namespacedPart);
  };

  const stylesInput = isFunction(originalStyles) ? originalStyles(selector) : originalStyles;
  let stylesOutput = stylesInput;

  if (process.env.EXTRACT_CSS) {
    stylesOutput = Object.keys(stylesInput).reduce((acc, part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return {
        ...acc,
        [interopDataAttrSelector(namespacedPart)]: stylesInput[part as Part],
      };
    }, {} as PrimitiveStyles<string>);
  }

  return [
    stylesOutput,
    (part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return interopDataAttrObj(namespacedPart);
    },
  ];
}

function getNamespacedPart(namespace: string, part: string) {
  return part === 'root' ? namespace : namespace + '.' + part;
}
