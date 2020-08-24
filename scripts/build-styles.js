const fs = require('fs');
const css = require('json-to-css');
const { interopDataAttrSelector } = require('@interop-ui/utils');
const { getNamespacedPart } = require('@interop-ui/react-utils');

const dirPath = process.cwd() + '/dist';
const namespace = process.argv[2];

function buildStyles() {
  const { styles } = require(dirPath);

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
    const cssFile = dirPath + '/styles.css';

    fs.writeFile(cssFile, cssStyles, (error) => {
      if (error) {
        console.log(`❌ Error creating ${cssFile}: `, error);
      } else {
        console.log('✅ Created file: ', cssFile);
      }
    });
  }
}

function flattenStyles(nestedStyles, rootSelector = []) {
  return Object.entries(nestedStyles).reduce((acc, [key, value]) => {
    // prevent empty rules from being added to the stylesheet
    if (value == null || (isObject(value) && !Object.values(value).length)) return acc;
    let flattened;

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
  }, {});
}

function toHyphen(cssProperty) {
  return cssProperty.replace(/([A-Z])/g, (char) => `-${char[0].toLowerCase()}`);
}

function isObject(value) {
  return typeof value === 'object';
}

buildStyles();
