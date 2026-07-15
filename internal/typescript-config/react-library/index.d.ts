/// <reference types="node" />
/// <reference types="@testing-library/react" />
/// <reference types="vitest-axe/extend-expect" />
/// <reference path="../../../scripts/setup-tests.ts" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
