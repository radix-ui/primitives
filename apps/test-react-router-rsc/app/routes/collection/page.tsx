import * as React from 'react';
import {
  Unstable,
  UnstableItem,
  Stable,
  StableItem,
} from '@repo/test-registry/components/collection';

export async function ServerComponent() {
  return (
    <div>
      <h2>Unstable Collection</h2>
      <Unstable>
        <UnstableItem>Item 1</UnstableItem>
        <UnstableItem>Item 2</UnstableItem>
        <UnstableItem>Item 3</UnstableItem>
      </Unstable>
      <hr />
      <h2>Stable Collection</h2>
      <Stable>
        <StableItem>Item 1</StableItem>
        <StableItem>Item 2</StableItem>
        <StableItem>Item 3</StableItem>
      </Stable>
    </div>
  );
}
