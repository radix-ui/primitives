import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as Accordion from './Accordion';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a basic Accordion', () => {
  let rendered: RenderResult;
  let button: HTMLElement;
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
      button = rendered.getByText('Button One');
      fireEvent.click(button);
      await waitFor(() => {
        panel = rendered.getByText('Panel One');
        expect(panel).toBeVisible();
      });
    });

    it('should open the associated panel', () => {
      expect(panel).toBeVisible();
    });

    describe('clicking another button', () => {
      beforeEach(async () => {
        button = rendered.getByText('Button Two');
        fireEvent.click(button);
        await waitFor(() => {
          panel = rendered.getByText('Panel Two');
          expect(panel).toBeVisible();
        });
      });

      it('should open the associated panel', () => {
        expect(panel).toBeVisible();
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
