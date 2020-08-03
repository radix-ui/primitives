import stringifyCSSObj from './stringifyCSSObj';
import hashStringIntoClass from './hashStringIntoClass';
import { Middleware } from './stringifyCSSObj';
import stylis from './stylis';

const cachedClasses = new Set();

/**
 * Takes a nested css object  or a css string and returns a class name that has the stylis applied
 * to it
 */
export function css(cssObjOrString: any | string, scope = '', middleware?: Middleware[]) {
  // convert the object into a string:
  const cssString = stringifyCSSObj(cssObjOrString, middleware || []);
  console.log('generating styles:');
  console.log(cssString);

  const styledClass = hashStringIntoClass(cssString);
  if (cachedClasses.has(styledClass)) {
    return styledClass;
  }
  // parse and add the stylis to the dom
  stylis(scope + '.' + styledClass, cssString);

  cachedClasses.add(styledClass);

  return styledClass;
}

export type { Middleware };

export default css;
