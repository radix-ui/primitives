import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cleanup, render, fireEvent, getByText, screen } from '@testing-library/react';
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
    </Toolbar.Root>,
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
      }),
    );

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  it('does not activate a ToolbarLink from Space typed into a portaled focusable descendant', () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root>
        <Toolbar.Link href="#" onClick={onClick}>
          Link
          {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const input = screen.getByTestId('input');
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('still activates the ToolbarLink via Space when the link itself is focused', () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root>
        <Toolbar.Link href="#" onClick={onClick}>
          Link
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByText('Link');
    link.focus();
    fireEvent.keyDown(link, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
