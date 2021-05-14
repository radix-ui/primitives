/**
 * We cannot configure `jest-dom` in `package.json` because:
 * > Note: If you're using TypeScript, make sure your setup file is a .ts and not a .js to include the necessary types.
 * > https://github.com/testing-library/jest-dom#usage
 */
import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  cb: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};
