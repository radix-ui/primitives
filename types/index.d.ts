declare const __DEV__: boolean;

declare module 'json-to-css';

declare module 'lodash.isequal' {
  import { isEqual } from 'lodash';
  export default isEqual;
}

declare module 'lodash.kebabcase' {
  import { kebabCase } from 'lodash';
  export default kebabCase;
}

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
