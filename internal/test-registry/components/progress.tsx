import * as React from 'react';
import { Progress } from 'radix-ui';

export function Basic() {
  return (
    <Progress.Root value={20}>
      <Progress.Indicator>Progress</Progress.Indicator>
    </Progress.Root>
  );
}
