import * as Switch from '@radix-ui/react-switch';
import { render } from '@testing-library/react';

describe('given a default Switch', () => {
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
