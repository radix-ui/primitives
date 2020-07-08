declare const __DEV__: boolean;

declare module 'stylis';

declare module 'lodash.merge' {
  import { merge } from 'lodash';
  export default merge;
}
