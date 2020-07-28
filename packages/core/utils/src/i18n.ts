import { getComputedStyleFromProperty } from './domUtils';

// https://en.wikipedia.org/wiki/Right-to-left
const RTL_SCRIPTS = [
  'Arab',
  'Syrc',
  'Samr',
  'Mand',
  'Thaa',
  'Mend',
  'Nkoo',
  'Adlm',
  'Rohg',
  'Hebr',
];
const RTL_LANGS = [
  'ae',
  'ar',
  'arc',
  'bcc',
  'bqi',
  'ckb',
  'dv',
  'fa',
  'glk',
  'he',
  'ku',
  'mzn',
  'nqo',
  'pnb',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
];

/**
 * Determines if a locale is read from right to left.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
 */
export function localeIsRTL(locale: string) {
  if (Intl.Locale) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/maximize
    let script = new Intl.Locale(locale).maximize().script;
    return RTL_SCRIPTS.includes(script);
  }
  return RTL_LANGS.includes(locale.split('-')[0]);
}

export function elementIsRTL(element: Element) {
  return (
    element.ownerDocument.dir === 'rtl' ||
    getComputedStyleFromProperty(element, 'direction') === 'rtl'
  );
}

export function isRTL(locale?: string, element?: Element | undefined | null) {
  try {
    let lang = locale || getLocale();
    return localeIsRTL(lang) || !!(element && elementIsRTL(element));
  } catch (err) {
    return false;
  }
}

export function getLocale() {
  return navigator
    ? (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        ((navigator as any).browserLanguage as string) ||
        ((navigator as any).userLanguage as string) ||
        'en-US'
    : 'en-US';
}
