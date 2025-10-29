import { reactVersion, DEFAULT_REACT_VERSION } from './test-env';

let alias: Record<string, string> = {};
if (reactVersion !== DEFAULT_REACT_VERSION) {
  alias = {
    react: `react-${reactVersion}`,
    'react-dom': `react-dom-${reactVersion}`,
    'react-is': `react-is-${reactVersion}`,
    '@testing-library/react': `@testing-library/react-${reactVersion}`,
  };
}

export { alias };
