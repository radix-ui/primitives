import { Middleware } from '@interop-ui/css';

// map values to theme values
const colorScaleKeys = new Set(['color', 'background-color', 'background', 'border-color']);

const themeValuePrefix = '$';
export const themeValuesMiddleware: Middleware = function (key, value) {
  if (value[0] === themeValuePrefix) {
    if (colorScaleKeys.has(key)) {
      return [key, `var(--mdz-colors-${value.substr(1)})`];
    }
  }
  return;
};
