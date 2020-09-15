/**
 * Checks whether or not a value is a function.
 *
 * @param value
 */
export function isFunction(value: any): value is Function {
  return !!(value && {}.toString.call(value) === '[object Function]');
}

/**
 * Checks whether or not a value is undefined.
 *
 * @param value
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}
