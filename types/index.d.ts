declare const __DEV__: boolean;

declare module 'stylis';

declare module 'lodash.merge' {
  import { merge } from 'lodash';
  export default merge;
}

declare module 'lodash.omit' {
  import { omit } from 'lodash';
  export default omit;
}

declare module 'lodash.pick' {
  import { pick } from 'lodash';
  export default pick;
}
