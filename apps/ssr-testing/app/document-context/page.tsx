import * as React from 'react';

import { Parent } from './parent';
import { Child } from './child';

export default function Page() {
  return (
    <Parent>
      <h1>Document Context</h1>
      <Child />
    </Parent>
  );
}
