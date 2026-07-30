import * as React from 'react';
import { axe } from 'vitest-axe';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import * as Accordion from './accordion';
import type { Mock } from 'vitest';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a single Accordion', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;

  afterEach(cleanup);

  describe('with default orientation', () => {
    beforeEach(() => {
      handleValueChange = vi.fn();
      rendered = render(
        <Accordion.Root data-testid="container" type="single" onValueChange={handleValueChange}>
          {ITEMS.map((val) => (
            <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
              <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
                <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Content {val}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>,
      );
    });

    it('should have no accessibility violations in default state', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    describe('when navigating by keyboard', () => {
      beforeEach(() => {
        const trigger = rendered.getByText('Trigger One');
        trigger.focus();
      });

      describe('on `ArrowDown`', () => {
        it('should move focus to the next trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
          expect(rendered.getByText('Trigger Two')).toHaveFocus();
        });

        it('should move focus to the first item if at the end', () => {
          const trigger = rendered.getByText('Trigger Three');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
          expect(rendered.getByText('Trigger One')).toHaveFocus();
        });
      });

      describe('on `ArrowUp`', () => {
        it('should move focus to the previous trigger', () => {
          const trigger = rendered.getByText('Trigger Three');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
          expect(rendered.getByText('Trigger Two')).toHaveFocus();
        });

        it('should move focus to the last item if at the beginning', () => {
          const trigger = rendered.getByText('Trigger One');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
          expect(rendered.getByText('Trigger Three')).toHaveFocus();
        });
      });

      describe('on `Home`', () => {
        it('should move focus to the first trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'Home' });
          expect(rendered.getByText('Trigger One')).toHaveFocus();
        });
      });

      describe('on `End`', () => {
        it('should move focus to the last trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'End' });
          expect(rendered.getByText('Trigger Three')).toHaveFocus();
        });
      });
    });

    describe('when clicking a trigger', () => {
      let trigger: HTMLElement;
      let contentOne: HTMLElement | null;

      beforeEach(() => {
        trigger = rendered.getByText('Trigger One');
        fireEvent.click(trigger);
        contentOne = rendered.getByText('Content One');
      });

      it('should show the content', () => {
        expect(contentOne).toBeVisible();
      });

      it('should have no accessibility violations', async () => {
        expect(await axe(rendered.container)).toHaveNoViolations();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith('One');
      });

      describe('then clicking the trigger again', () => {
        beforeEach(() => {
          fireEvent.click(trigger);
        });

        it('should not close the content', () => {
          expect(contentOne).toBeVisible();
        });

        it('should not call onValueChange', () => {
          expect(handleValueChange).toHaveBeenCalledTimes(1);
        });
      });

      describe('then clicking another trigger', () => {
        beforeEach(() => {
          const trigger = rendered.getByText('Trigger Two');
          fireEvent.click(trigger);
        });

        it('should show the new content', () => {
          const contentTwo = rendered.getByText('Content Two');
          expect(contentTwo).toBeVisible();
        });

        it('should call onValueChange', () => {
          expect(handleValueChange).toHaveBeenCalledWith('Two');
        });

        it('should hide the previous content', () => {
          expect(contentOne).not.toBeVisible();
        });
      });
    });
  });

  describe('with orientation=vertical', () => {
    beforeEach(() => {
      handleValueChange = vi.fn();
      rendered = render(
        <Accordion.Root data-testid="container" type="single" onValueChange={handleValueChange}>
          {ITEMS.map((val) => (
            <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
              <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
                <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Content {val}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>,
      );
    });

    it('should have no accessibility violations in default state', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    describe('when navigating by keyboard', () => {
      beforeEach(() => {
        const trigger = rendered.getByText('Trigger One');
        trigger.focus();
      });

      describe('on `ArrowDown`', () => {
        it('should move focus to the next trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
          expect(rendered.getByText('Trigger Two')).toHaveFocus();
        });

        it('should move focus to the first item if at the end', () => {
          const trigger = rendered.getByText('Trigger Three');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
          expect(rendered.getByText('Trigger One')).toHaveFocus();
        });
      });

      describe('on `ArrowUp`', () => {
        it('should move focus to the previous trigger', () => {
          const trigger = rendered.getByText('Trigger Three');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
          expect(rendered.getByText('Trigger Two')).toHaveFocus();
        });

        it('should move focus to the last item if at the beginning', () => {
          const trigger = rendered.getByText('Trigger One');
          trigger.focus();
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
          expect(rendered.getByText('Trigger Three')).toHaveFocus();
        });
      });

      describe('on `Home`', () => {
        it('should move focus to the first trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'Home' });
          expect(rendered.getByText('Trigger One')).toHaveFocus();
        });
      });

      describe('on `End`', () => {
        it('should move focus to the last trigger', () => {
          fireEvent.keyDown(document.activeElement!, { key: 'End' });
          expect(rendered.getByText('Trigger Three')).toHaveFocus();
        });
      });
    });

    describe('when clicking a trigger', () => {
      let trigger: HTMLElement;
      let contentOne: HTMLElement | null;

      beforeEach(() => {
        trigger = rendered.getByText('Trigger One');
        fireEvent.click(trigger);
        contentOne = rendered.getByText('Content One');
      });

      it('should show the content', () => {
        expect(contentOne).toBeVisible();
      });

      it('should have no accessibility violations', async () => {
        expect(await axe(rendered.container)).toHaveNoViolations();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith('One');
      });

      describe('then clicking the trigger again', () => {
        beforeEach(() => {
          fireEvent.click(trigger);
        });

        it('should not close the content', () => {
          expect(contentOne).toBeVisible();
        });

        it('should not call onValueChange', () => {
          expect(handleValueChange).toHaveBeenCalledTimes(1);
        });
      });

      describe('then clicking another trigger', () => {
        beforeEach(() => {
          const trigger = rendered.getByText('Trigger Two');
          fireEvent.click(trigger);
        });

        it('should show the new content', () => {
          const contentTwo = rendered.getByText('Content Two');
          expect(contentTwo).toBeVisible();
        });

        it('should call onValueChange', () => {
          expect(handleValueChange).toHaveBeenCalledWith('Two');
        });

        it('should hide the previous content', () => {
          expect(contentOne).not.toBeVisible();
        });
      });
    });
  });

  describe('with orientation=horizontal', () => {
    describe('and default dir="ltr"', () => {
      beforeEach(() => {
        handleValueChange = vi.fn();
        rendered = render(
          <Accordion.Root
            data-testid="container"
            type="single"
            orientation="horizontal"
            onValueChange={handleValueChange}
          >
            {ITEMS.map((val) => (
              <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
                <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
                  <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>Content {val}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>,
        );
      });

      describe('when navigating by keyboard', () => {
        beforeEach(() => {
          const trigger = rendered.getByText('Trigger One');
          trigger.focus();
        });

        describe('on `ArrowUp`', () => {
          it('should do nothing', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `ArrowDown`', () => {
          it('should do nothing', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `ArrowRight`', () => {
          it('should move focus to the next trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
            expect(rendered.getByText('Trigger Two')).toHaveFocus();
          });

          it('should move focus to the first item if at the end', () => {
            const trigger = rendered.getByText('Trigger Three');
            trigger.focus();
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `ArrowLeft`', () => {
          it('should move focus to the previous trigger', () => {
            const trigger = rendered.getByText('Trigger Three');
            trigger.focus();
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
            expect(rendered.getByText('Trigger Two')).toHaveFocus();
          });

          it('should move focus to the last item if at the beginning', () => {
            const trigger = rendered.getByText('Trigger One');
            trigger.focus();
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
            expect(rendered.getByText('Trigger Three')).toHaveFocus();
          });
        });

        describe('on `Home`', () => {
          it('should move focus to the first trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'Home' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `End`', () => {
          it('should move focus to the last trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'End' });
            expect(rendered.getByText('Trigger Three')).toHaveFocus();
          });
        });
      });
    });

    describe('and dir="rtl"', () => {
      beforeEach(() => {
        handleValueChange = vi.fn();
        rendered = render(
          <Accordion.Root
            data-testid="container"
            type="single"
            dir="rtl"
            orientation="horizontal"
            onValueChange={handleValueChange}
          >
            {ITEMS.map((val) => (
              <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
                <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
                  <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>Content {val}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>,
        );
      });

      describe('when navigating by keyboard', () => {
        beforeEach(() => {
          const trigger = rendered.getByText('Trigger One');
          trigger.focus();
        });

        describe('on `ArrowUp`', () => {
          it('should do nothing', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `ArrowDown`', () => {
          it('should do nothing', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `ArrowRight`', () => {
          it('should move focus to the previous trigger', () => {
            const trigger = rendered.getByText('Trigger Two');
            trigger.focus();
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });

          it('should move focus to the last item if at the beginning', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
            expect(rendered.getByText('Trigger Three')).toHaveFocus();
          });
        });

        describe('on `ArrowLeft`', () => {
          it('should move focus to the next trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
            expect(rendered.getByText('Trigger Two')).toHaveFocus();
          });

          it('should move focus to the first item if at the end', () => {
            const trigger = rendered.getByText('Trigger Three');
            trigger.focus();
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `Home`', () => {
          it('should move focus to the first trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'Home' });
            expect(rendered.getByText('Trigger One')).toHaveFocus();
          });
        });

        describe('on `End`', () => {
          it('should move focus to the last trigger', () => {
            fireEvent.keyDown(document.activeElement!, { key: 'End' });
            expect(rendered.getByText('Trigger Three')).toHaveFocus();
          });
        });
      });
    });
  });
});

describe('given a multiple Accordion', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;

  afterEach(cleanup);

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(
      <Accordion.Root data-testid="container" type="multiple" onValueChange={handleValueChange}>
        {ITEMS.map((val) => (
          <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
            <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
              <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content {val}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>,
    );
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when navigating by keyboard', () => {
    beforeEach(() => {
      rendered.getByText('Trigger One').focus();
    });

    describe('on `ArrowDown`', () => {
      it('should move focus to the next trigger', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
        expect(rendered.getByText('Trigger Two')).toHaveFocus();
      });
    });

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous trigger', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
        expect(rendered.getByText('Trigger Three')).toHaveFocus();
      });
    });

    describe('on `Home`', () => {
      it('should move focus to the first trigger', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'Home' });
        expect(rendered.getByText('Trigger One')).toHaveFocus();
      });
    });

    describe('on `End`', () => {
      it('should move focus to the last trigger', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'End' });
        expect(rendered.getByText('Trigger Three')).toHaveFocus();
      });
    });
  });

  describe('when clicking a trigger', () => {
    let trigger: HTMLElement;
    let contentOne: HTMLElement | null;

    beforeEach(() => {
      trigger = rendered.getByText('Trigger One');
      fireEvent.click(trigger);
      contentOne = rendered.getByText('Content One');
    });

    it('should show the content', () => {
      expect(contentOne).toBeVisible();
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should call onValueChange', () => {
      expect(handleValueChange).toHaveBeenCalledWith(['One']);
    });

    describe('then clicking the trigger again', () => {
      beforeEach(() => {
        fireEvent.click(trigger);
      });

      it('should hide the content', () => {
        expect(contentOne).not.toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith([]);
      });
    });

    describe('then clicking another trigger', () => {
      beforeEach(() => {
        const trigger = rendered.getByText('Trigger Two');
        fireEvent.click(trigger);
      });

      it('should show the new content', () => {
        const contentTwo = rendered.getByText('Content Two');
        expect(contentTwo).toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith(['One', 'Two']);
      });

      it('should not hide the previous content', () => {
        expect(contentOne).toBeVisible();
      });
    });
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/3478
describe('given a controlled single collapsible Accordion', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;

  afterEach(cleanup);

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(<ControlledSingleAccordion collapsible onValueChange={handleValueChange} />);
  });

  describe('when clicking an open item trigger', () => {
    let trigger: HTMLElement;

    beforeEach(() => {
      trigger = rendered.getByText('Trigger One');
      fireEvent.click(trigger);
    });

    it('should open the item and call onValueChange once', () => {
      expect(rendered.getByText('Content One')).toBeVisible();
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenLastCalledWith('One');
    });

    describe('then clicking the same trigger again', () => {
      beforeEach(() => {
        fireEvent.click(trigger);
      });

      it('should close the item in a single click', () => {
        expect(rendered.queryByText('Content One')).not.toBeInTheDocument();
      });

      it('should call onValueChange exactly once more (with an empty value)', () => {
        expect(handleValueChange).toHaveBeenCalledTimes(2);
        expect(handleValueChange).toHaveBeenLastCalledWith('');
      });
    });
  });

  function ControlledSingleAccordion({
    onValueChange,
    ...props
  }: Omit<
    React.ComponentPropsWithoutRef<typeof Accordion.Root> & { type: 'single' },
    'type' | 'value'
  >) {
    const [value, setValue] = React.useState('');
    return (
      <Accordion.Root
        data-testid="container"
        type="single"
        {...props}
        value={value}
        onValueChange={(next: string) => {
          setValue(next);
          onValueChange?.(next);
        }}
      >
        {ITEMS.map((val) => (
          <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
            <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
              <Accordion.Trigger>Trigger {val}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content {val}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    );
  }
});

describe('Accordion.Root', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <Accordion.Root
        type="single"
        defaultValue="one"
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Accordion.Item value="one" />
      </Accordion.Root>,
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
      <Accordion.Root
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
          <Accordion.Item value="one" />
        </article>
      </Accordion.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Accordion.Item', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item
          value="one"
          ref={ref}
          data-testid="item"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Accordion.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item
          value="one"
          asChild
          ref={ref}
          data-testid="item"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Accordion.Item>
      </Accordion.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('ARTICLE');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Accordion.Header', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Header
            ref={ref}
            data-testid="header"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </Accordion.Item>
      </Accordion.Root>,
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-class');
    expect(header.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(header);

    fireEvent.click(header);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Header
            asChild
            ref={ref}
            data-testid="header"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const header = screen.getByTestId('header');
    expect(header.tagName).toBe('ARTICLE');
    expect(header).toHaveClass('custom-class');
    expect(header.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(header);

    fireEvent.click(header);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Accordion.Trigger', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Header>
            <Accordion.Trigger
              ref={ref}
              data-testid="trigger"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Trigger
            </Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    // Composed with the trigger's own click handler rather than replaced by it.
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Header>
            <Accordion.Trigger
              asChild
              ref={ref}
              data-testid="trigger"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Trigger</button>
            </Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Accordion.Content', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Content
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Content</article>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});
