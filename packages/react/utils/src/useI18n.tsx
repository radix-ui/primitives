import * as React from 'react';
import { getLocale, isRTL } from '@interop-ui/utils';

let currentLocale = getLocale();
let listeners = new Set<(locale: string) => void>();

export function useLocale() {
  let [locale, setLocale] = React.useState(currentLocale);

  React.useEffect(() => {
    if (!listeners.size) {
      window.addEventListener('languagechange', updateLocale);
    }
    listeners.add(setLocale);

    return () => {
      listeners.delete(setLocale);
      if (!listeners.size) {
        window.removeEventListener('languagechange', updateLocale);
      }
    };
  }, []);

  return locale;
}

export function useTextDirection(
  locale: string,
  ref?: React.RefObject<Element | null | undefined>
) {
  // TODO: Consider observer for DOM ref
  return React.useMemo(() => (isRTL(locale, ref && ref.current) ? 'rtl' : 'ltr'), [locale, ref]);
}

export function useI18n(ref?: React.RefObject<Element | null | undefined>) {
  let locale = useLocale();
  return {
    locale,
    direction: useTextDirection(locale, ref),
  };
}

function updateLocale() {
  currentLocale = getLocale();
  for (let listener of listeners) {
    listener(currentLocale);
  }
}
