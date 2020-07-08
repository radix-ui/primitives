import murmurhash from './murmurhash';
const charsLength = 52;

/* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
const getAlphabeticChar = (code: number) => String.fromCharCode(code + (code > 25 ? 39 : 97));

/* input a number, usually a hash and convert it to base-52 */
const getClassFromHash = (code: number) => {
  let name = '';
  let x;

  /* get a char and divide by alphabet-length */
  for (x = code; x > charsLength; x = Math.floor(x / charsLength)) {
    name = getAlphabeticChar(x % charsLength) + name;
  }

  return getAlphabeticChar(x % charsLength) + name;
};

export const hashCSSStringIntoClass = (cssString: string) =>
  getClassFromHash(murmurhash(cssString));

export default hashCSSStringIntoClass;
