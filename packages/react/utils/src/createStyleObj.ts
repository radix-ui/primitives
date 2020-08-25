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

  const styles = isFunction(originalStyles) ? originalStyles(selector) : originalStyles;

  return [
    styles,
    (part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return interopDataAttrObj(namespacedPart);
    },
  ];
}

export function getNamespacedPart(namespace: string, part: string) {
  return part === 'root' ? namespace : namespace + '.' + part;
}
