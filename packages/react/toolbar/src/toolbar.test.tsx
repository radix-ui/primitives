import { cleanup, render, fireEvent, getByText } from '@testing-library/react';
import * as Toolbar from './toolbar';
import { afterEach, describe, it, vi, expect } from 'vitest';

const component = (props: any) => {
  return render(
    <Toolbar.Root>
      <Toolbar.ToggleGroup type="single">
        <Toolbar.ToggleItem value="left" onClick={props.onClick}>
          Left
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
};

describe('given a default Toolbar', () => {
  afterEach(cleanup);
  it('Click event should be called just once', async () => {
    const spy = vi.fn();

    const rendered = component({
      onClick: spy,
    });

    fireEvent(
      getByText(rendered.container, 'Left'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
