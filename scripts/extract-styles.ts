import fs from 'fs';
import path from 'path';
import css from 'json-to-css';

const projectRoot = path.resolve(__dirname, '../');
const dirPath = projectRoot + '/' + process.argv[2];

function build() {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const source = dirPath + '/' + file;

    if (fs.statSync(source).isDirectory()) {
      const { styles } = require(source);

      if (styles) {
        const cssObj = flattenStyles(styles);
        const cssStyles = css.of(cssObj);
        const cssFile = source + '/dist/styles.css';

        fs.writeFile(cssFile, cssStyles, (error) => {
          if (error) {
            console.log(`❌ Error creating ${cssFile}: `, error);
          } else {
            console.log('✅ Created file: ', cssFile);
          }
        });
      }
    }
  });
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

build();
