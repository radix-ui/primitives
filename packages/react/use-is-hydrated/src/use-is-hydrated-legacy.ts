import * as React from 'react';

let _isHydrated = false;

export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = React.useState(_isHydrated);
  React.useEffect(() => {
    if (!_isHydrated) {
      _isHydrated = true;
      setIsHydrated(true);
    }
  }, []);
  return isHydrated;
}
