import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, fireEvent, screen } from '@testing-library/react';
import * as ToggleGroup from './toggle-group';
import type { Mock } from 'vitest';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

describe('given a single ToggleGroup', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let one: HTMLElement;
  let two: HTMLElement;

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(
      <ToggleGroup.Root type="single" onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
        <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="Three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    one = rendered.getByText('One');
    two = rendered.getByText('Two');
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking `One`', () => {
    beforeEach(() => {
      fireEvent.click(one);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should have radiogroup role', () => {
      expect(rendered.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('should change value to `One`', () => {
      expect(handleValueChange).toHaveBeenCalledWith('One');
    });

    describe('then clicking `Two`', () => {
      beforeEach(() => {
        fireEvent.click(two);
      });

      it('should change value to `Two`', () => {
        expect(handleValueChange).toHaveBeenCalledWith('Two');
      });

      describe('and clicking `Two` again`', () => {
        beforeEach(() => {
          fireEvent.click(two);
        });

        it('should change value to empty string', () => {
          expect(handleValueChange).toHaveBeenCalledWith('');
        });
      });
    });
  });
});

describe('given a multiple ToggleGroup', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let one: HTMLElement;
  let two: HTMLElement;

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(
      <ToggleGroup.Root type="multiple" onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
        <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="Three">Three</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    one = rendered.getByText('One');
    two = rendered.getByText('Two');
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have toolbar role', () => {
    expect(rendered.getByRole('toolbar')).toBeInTheDocument();
  });

  describe('when clicking `One`', () => {
    beforeEach(() => {
      fireEvent.click(one);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should change value to `One`', () => {
      expect(handleValueChange).toHaveBeenCalledWith(['One']);
    });

    describe('and clicking `One` again`', () => {
      beforeEach(() => {
        fireEvent.click(one);
      });

      it('should change value to empty array', () => {
        expect(handleValueChange).toHaveBeenCalledWith([]);
      });
    });

    describe('then clicking `Two`', () => {
      beforeEach(() => {
        fireEvent.click(two);
      });

      it('should add `Two` to value', () => {
        expect(handleValueChange).toHaveBeenCalledWith(['One', 'Two']);
      });

      describe('and clicking `Two` again`', () => {
        beforeEach(() => {
          fireEvent.click(two);
        });

        it('should change value to `One`', () => {
          expect(handleValueChange).toHaveBeenCalledWith(['One']);
        });
      });
    });
  });
});

describe('ToggleGroup.Root', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="one"
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <ToggleGroup.Item value="one">Item</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="one"
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <ToggleGroup.Item value="one">Item</ToggleGroup.Item>
        </article>
      </ToggleGroup.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('role', 'radiogroup');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ToggleGroup.Item', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <ToggleGroup.Root type="single" defaultValue="one">
        <ToggleGroup.Item
          value="one"
          ref={ref}
          data-testid="item"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Item
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    // Composed with the item's own handler rather than replaced
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <ToggleGroup.Root type="single" defaultValue="one">
        <ToggleGroup.Item
          value="one"
          asChild
          ref={ref}
          data-testid="item"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Item</button>
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('BUTTON');
    expect(item).toHaveAttribute('role', 'radio');
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(item).toHaveAttribute('data-state', 'on');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('keyboard interaction for the radio roles', () => {
  afterEach(cleanup);

  it('checks the item the arrow key moves to when `type="single"`', async () => {
    const handleValueChange = vi.fn();
    render(
      <ToggleGroup.Root type="single" defaultValue="One" onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
        <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const one = screen.getByText('One');
    const two = screen.getByText('Two');

    await act(async () => one.focus());
    // `RovingFocusGroup` moves focus to the next item on arrow keys; once an
    // item is focused during arrow navigation it should also become checked.
    await act(async () => {
      fireEvent.keyDown(one, { key: 'ArrowRight' });
      two.focus();
    });

    expect(handleValueChange).toHaveBeenCalledWith('Two');
    expect(two).toHaveAttribute('aria-checked', 'true');
    expect(one).toHaveAttribute('aria-checked', 'false');
  });

  it('leaves the value alone when focus arrives without an arrow key', async () => {
    const handleValueChange = vi.fn();
    render(
      <ToggleGroup.Root type="single" defaultValue="One" onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
        <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    await act(async () => screen.getByText('Two').focus());

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(screen.getByText('One')).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps the item checked when the arrow key lands back on it', async () => {
    const handleValueChange = vi.fn();
    render(
      <ToggleGroup.Root type="single" defaultValue="One" onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const one = screen.getByText('One');

    await act(async () => one.focus());
    await act(async () => {
      fireEvent.keyDown(one, { key: 'ArrowRight' });
      one.focus();
    });

    // `Toggle` would turn it back off, which a radio group never does.
    expect(one).toHaveAttribute('aria-checked', 'true');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('does not check on arrow keys when `type="multiple"`', async () => {
    const handleValueChange = vi.fn();
    render(
      <ToggleGroup.Root type="multiple" defaultValue={['One']} onValueChange={handleValueChange}>
        <ToggleGroup.Item value="One">One</ToggleGroup.Item>
        <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const one = screen.getByText('One');
    const two = screen.getByText('Two');

    await act(async () => one.focus());
    await act(async () => {
      fireEvent.keyDown(one, { key: 'ArrowRight' });
      two.focus();
    });

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(two).toHaveAttribute('aria-pressed', 'false');
  });
});
