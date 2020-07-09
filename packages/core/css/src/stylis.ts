import { compile, serialize, rulesheet, middleware, stringify } from 'stylis';

let interopStyleElm: HTMLStyleElement | null = document.querySelector('style[data-interop-styles]');

let sheet: undefined | CSSStyleSheet;

if (interopStyleElm) {
  sheet = interopStyleElm.sheet as CSSStyleSheet;
}

if (!interopStyleElm || !sheet) {
  interopStyleElm = document.createElement('style');
  interopStyleElm.setAttribute('data-interop-styles', 'true');
  sheet = document.head.appendChild(interopStyleElm).sheet as CSSStyleSheet;
}

if (!sheet) {
  throw new Error('something is wrong yo!');
}

let cssSheetLength = sheet.cssRules.length;

// stylis
export const stylis = (scope: string, cssString: string) => {
  // parse the css string using stylis and add it to the sheet
  serialize(
    compile(`${scope}{${cssString}}`),
    middleware([
      stringify,
      rulesheet((value: any) => {
        cssSheetLength = sheet!.insertRule(value, cssSheetLength) + 1;
      }),
    ])
  );
};

export default stylis;
