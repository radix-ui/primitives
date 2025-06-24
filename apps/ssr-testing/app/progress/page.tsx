import * as React from 'react';
import { Progress } from 'radix-ui';

export default function Page() {
  return (
    <Progress.Root value={20}>
      <Progress.Indicator>Progress</Progress.Indicator>
    </Progress.Root>
  );
}
