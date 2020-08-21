import fs from 'fs';
import css from 'json-to-css';
import { interopDataAttrSelector } from '@interop-ui/utils';
import { getNamespacedPart } from '@interop-ui/react-utils';

const dirPath = process.cwd();
const namespace = process.argv[2];

function buildStyles() {
  const { styles } = require(dirPath + '/src');

  if (styles) {
    const styleKeysAsDataAttrs = Object.keys(styles).reduce((acc, part) => {
      const namespacedPart = getNamespacedPart(namespace, part);
      return {
        ...acc,
        [interopDataAttrSelector(namespacedPart)]: styles[part],
      };
    }, {});

    const cssObj = flattenStyles(styleKeysAsDataAttrs);
    const cssStyles = css.of(cssObj);
    const dist = dirPath + '/dist';
    const cssFile = dist + '/styles.css';

    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist);
    }

    fs.writeFile(cssFile, cssStyles, (error) => {
      if (error) {
        console.log(`❌ Error creating ${cssFile}: `, error);
      } else {
        console.log('✅ Created file: ', cssFile);
      }
    });
  }
}

type StyleObject<T = string | number> = Record<string, T>;
type NestedStyleObject = StyleObject<StyleObject | string | number>;
type FlattenedStyleObject = Record<string, StyleObject>;

function flattenStyles(
  nestedStyles: NestedStyleObject,
  rootSelector: string[] = []
): FlattenedStyleObject {
  return Object.entries(nestedStyles).reduce((acc, [key, value]) => {
    // prevent empty rules from being added to the stylesheet
    if (value == null || (isObject(value) && !Object.values(value).length)) return acc;
    let flattened: FlattenedStyleObject;

    if (isObject(value)) {
      const selector = key.replace('&', '');
      flattened = flattenStyles(value, [...rootSelector, selector]);
    } else {
      const selector = rootSelector.join('');
      const cssProperty = key;

      flattened = {
        [selector]: {
          ...acc[selector],
          [toHyphen(cssProperty)]: value,
        },
      };
    }

    return Object.assign({}, acc, flattened);
  }, {} as any);
}

function toHyphen(cssProperty: string) {
  return cssProperty.replace(/([A-Z])/g, (char) => `-${char[0].toLowerCase()}`);
}

function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object';
}

buildStyles();
