import * as Switch from './switch';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';

describe('given a default Switch', () => {
  afterEach(cleanup);

  let cleanedUp = false;

  function Test() {
    return (
      <Switch.Root
        ref={() => () => {
          cleanedUp = true;
        }}
      >
        <Switch.Thumb />
      </Switch.Root>
    );
  }

  it('should correctly invoke the cleanup function of a ref callback', () => {
    const rendered = render(<Test />);
    rendered.unmount();
    expect(cleanedUp).toBe(true);
  });
});
