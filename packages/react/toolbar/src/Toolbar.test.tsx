import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import * as Toolbar from '@radix-ui/react-toolbar';


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
}

describe('given a default Toolbar', () => {
  it('should have no accessibility violations', async () => {
    const spy = jest.fn();

    const rendered = component({
      onClick: spy
    })

    fireEvent(
      getByText(rendered.container, 'Left'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
