import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as Accordion from './Accordion';
import { getSelector } from '@radix-ui/utils';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a basic Accordion', () => {
  let rendered: RenderResult;
  let button: HTMLElement;
  let header: HTMLElement;
  let item: HTMLElement;
  let panel: HTMLElement | null;

  beforeEach(() => {
    rendered = render(<AccordionTest />);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with an open panel', async () => {
    button = rendered.getByText('Button Two');
    fireEvent.click(button);
    await waitFor(() => void rendered.getByText('Panel Two'));
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should collapse all panels by default', () => {
    for (const item of ITEMS) {
      panel = rendered.queryByText(`Panel ${item}`);
      expect(panel).not.toBeInTheDocument();
    }
  });

  it('should have a radix attribute on the item', () => {
    item = rendered.getByTestId('item-one');
    const partDataAttr = `data-${getSelector('AccordionItem')}`;
    expect(item).toHaveAttribute(partDataAttr);
  });

  it('should have a radix attribute on the header', () => {
    header = rendered.getByTestId('header-one');
    const partDataAttr = `data-${getSelector('AccordionHeader')}`;
    expect(header).toHaveAttribute(partDataAttr);
  });

  it('should have a radix attribute on the button', () => {
    button = rendered.getByText('Button One');
    const partDataAttr = `data-${getSelector('AccordionButton')}`;
    expect(button).toHaveAttribute(partDataAttr);
  });

  describe('when navigating by keyboard', () => {
    beforeEach(() => {
      rendered.getByText('Button One').focus();
    });

    describe('on `ArrowDown`', () => {
      it('should move focus to the next button', async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
        expect(rendered.getByText('Button Two')).toHaveFocus();
      });
    });

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous button', async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });

    describe('on `Home`', () => {
      it('should move focus to the first button', async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'Home' });
        expect(rendered.getByText('Button One')).toHaveFocus();
      });
    });

    describe('on `End`', () => {
      it('should move focus to the last button', async () => {
        fireEvent.keyDown(document.activeElement!, { key: 'End' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });
  });

  describe('when clicking a button', () => {
    beforeEach(async () => {
      item = rendered.getByTestId('item-one');
      header = rendered.getByTestId('header-one');
      button = rendered.getByText('Button One');
      fireEvent.click(button);
      await waitFor(() => {
        panel = rendered.getByText('Panel One');
        expect(panel).toBeVisible();
      });
    });

    it('should have a radix attribute on the panel', () => {
      const partDataAttr = `data-${getSelector('AccordionPanel')}`;
      expect(panel).toHaveAttribute(partDataAttr);
    });

    it('should have a data-state attribute on the item container set to `open`', () => {
      expect(item).toHaveAttribute('data-state', 'open');
    });

    it('should have a data-state attribute on the button set to `open`', () => {
      expect(button).toHaveAttribute('data-state', 'open');
    });

    describe('clicking another button', () => {
      beforeEach(async () => {
        item = rendered.getByTestId('item-two');
        header = rendered.getByTestId('header-two');
        button = rendered.getByText('Button Two');
        fireEvent.click(button);
        await waitFor(() => {
          panel = rendered.getByText('Panel Two');
          expect(panel).toBeVisible();
        });
      });

      it('should have a data-state attribute on the item container set to `open`', () => {
        expect(item).toHaveAttribute('data-state', 'open');
      });

      it('should have a data-state attribute on the button set to `open`', () => {
        expect(button).toHaveAttribute('data-state', 'open');
      });

      it('should have a data-state attribute on the previous item container set to `closed`', () => {
        const previousItem = rendered.getByTestId('item-one');
        expect(previousItem).toHaveAttribute('data-state', 'closed');
      });

      it('should have a data-state attribute on the button set to `closed`', () => {
        const previousButton = rendered.getByText('Button One');
        expect(previousButton).toHaveAttribute('data-state', 'closed');
      });
    });
  });
});

describe('given an Accordion with a change callback', () => {
  it('should call onValueChange', async () => {
    const handleValueChange = jest.fn();
    const rendered = render(<AccordionTest onValueChange={handleValueChange} />);
    const button = rendered.getByText('Button Two');
    fireEvent.click(button);
    await waitFor(() => void rendered.getByText('Panel Two'));
    expect(handleValueChange).toHaveBeenCalledTimes(1);
  });
});

describe('given an Accordion with a false `disabled` prop', () => {
  describe('and a disabled item', () => {
    let rendered: RenderResult;

    beforeEach(() => {
      rendered = render(
        <DisabledAccordionTest>
          <Accordion.Item value="disabled" data-testid="item-disabled" disabled>
            <Accordion.Header>
              <Accordion.Button data-testid="button-disabled">Button disabled</Accordion.Button>
            </Accordion.Header>
            <Accordion.Panel>Panel disabled</Accordion.Panel>
          </Accordion.Item>
        </DisabledAccordionTest>
      );
    });

    it('should disable the disabled item', () => {
      const item = rendered.queryByTestId('item-disabled');
      expect(item).toHaveAttribute('data-disabled');
    });

    it('should disable the disabled item button', () => {
      const button = rendered.queryByTestId('button-disabled');
      expect(button).toHaveAttribute('disabled');
    });

    it('should enable all other items', () => {
      const items = rendered.queryAllByTestId('item');
      const disabled = items.some((item) => item.getAttribute('data-disabled'));
      expect(disabled).toBe(false);
    });

    it('should enable all other item buttons', () => {
      const buttons = rendered.queryAllByTestId('button');
      const disabled = buttons.some((button) => button.getAttribute('disabled'));
      expect(disabled).toBe(false);
    });
  });
});

function DisabledAccordionTest(props: React.ComponentProps<typeof Accordion.Root>) {
  const { children, ...rootProps } = props;
  return (
    <Accordion.Root {...rootProps} disabled={false}>
      {ITEMS.map((val) => (
        <Accordion.Item value={val} key={val} data-testid="item">
          <Accordion.Header>
            <Accordion.Button data-testid="button">Button</Accordion.Button>
          </Accordion.Header>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      ))}
      {children}
    </Accordion.Root>
  );
}

function AccordionTest(props: React.ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root data-testid="container" {...props}>
      {ITEMS.map((val) => (
        <Accordion.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
          <Accordion.Header data-testid={`header-${val.toLowerCase()}`}>
            <Accordion.Button>Button {val}</Accordion.Button>
          </Accordion.Header>
          <Accordion.Panel>Panel {val}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
