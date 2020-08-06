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
            console.log(`Error creating ${cssFile}: `, error);
          } else {
            console.log('Created file: ', cssFile);
          }
        });
      }
    }
  });
}

type StyleObject<T = string | number> = Record<string, T>;
type NestedStyleObject = StyleObject<StyleObject | string | number>;

function flattenStyles(
  nestedStyles: NestedStyleObject,
  rootSelector: string[] = []
): StyleObject<Record<string, StyleObject>> {
  return Object.entries(nestedStyles).reduce((acc, [key, value]) => {
    if (!value || !Object.values(value).length) return acc;

    const flattened = isNestedObject(value)
      ? flattenStyles(value, [...rootSelector, key])
      : { [[...rootSelector, key.replace('&', '')].join('')]: value };

    return Object.assign({}, acc, flattened);
  }, {});
}

const isNestedObject = (value: any): value is NestedStyleObject => {
  return (
    typeof value === 'object' && Object.entries(value).some(([, v]) => v && typeof v === 'object')
  );
};

build();
