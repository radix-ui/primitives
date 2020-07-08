import React from 'react';
import { ThemeManager } from './Theme';

const defaultBreakPoints = ThemeManager.theme.breakpoints;

export const ResponsiveContext = React.createContext<Boolean[]>([]);

export function InteropProvider(props: any) {
  const [breakPointsMatch, setBreakPointMatch] = React.useState<Boolean[]>([]);

  React.useLayoutEffect(() => {
    ThemeManager.injectTheme();
    const queries = defaultBreakPoints.map((breakPoint) =>
      window.matchMedia(`(min-width:${breakPoint})`)
    );
    // set initial matches
    setBreakPointMatch(queries.map((match) => match.matches));

    // monitor matches for changes
    queries.forEach((query) => {
      query.addListener((_) => {
        setBreakPointMatch(queries.map((match) => match.matches));
      });
    });
  }, []);

  return <ResponsiveContext.Provider value={breakPointsMatch} {...props} />;
}

export const _matchValuesAgainstBreakPoints = (
  valueOrValues: string | string[],
  breakpoints: Boolean[]
) => {
  // not an array === just return it
  if (!(valueOrValues instanceof Array)) {
    return valueOrValues;
  }
  // first value is always a match
  const [firstValue, ...Rest] = valueOrValues;

  let matchedValue = firstValue;
  for (let i = 0; i < breakpoints.length; i++) {
    const isAMatch = breakpoints[i];
    // media query is a match
    if (isAMatch) {
      // we have a value with that index
      if (Rest[i]) {
        // update the matched value
        matchedValue = Rest[i];
      }
    } else {
      // query does not match
      return matchedValue;
    }
  }
  return matchedValue;
};

export const useResponsiveValue = (valueOrMultipleValues: string | string[]) => {
  const matches = React.useContext(ResponsiveContext);
  return _matchValuesAgainstBreakPoints(valueOrMultipleValues, matches);
};
