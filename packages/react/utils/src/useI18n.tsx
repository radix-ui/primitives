import * as React from 'react';
import { getCollator, getLocale, isRTL } from '@interop-ui/utils';
import { useConstant } from './useConstant';

export function useCollator(options?: Intl.CollatorOptions) {
  let locale = useLocale();
  return getCollator(locale, options);
}

export function useI18n(ref?: React.RefObject<Element | null | undefined>) {
  let locale = useLocale();
  return {
    locale,
    direction: useTextDirection(locale, ref),
  };
}

export function useLocale() {
  let localeRef = React.useRef(getLocale());
  let [locale, setLocale] = React.useState(localeRef.current);
  let listeners = useConstant(() => new Set<(locale: string) => void>());

  React.useEffect(() => {
    let hasListeners = !!listeners.size;
    if (!hasListeners) {
      window.addEventListener('languagechange', handleLanguageChange);
    }
    listeners.add(setLocale);

    return () => {
      listeners.delete(setLocale);
      if (!hasListeners) {
        window.removeEventListener('languagechange', handleLanguageChange);
      }
    };

    function handleLanguageChange() {
      localeRef.current = getLocale();
      listeners.forEach((listener) => {
        listener(localeRef.current);
      });
    }
  }, [listeners]);

  return locale;
}

export function useTextDirection(
  locale: string,
  ref?: React.RefObject<Element | null | undefined>
) {
  // TODO: Consider observer for DOM ref
  return React.useMemo(() => (isRTL(locale, ref && ref.current) ? 'rtl' : 'ltr'), [locale, ref]);
}
