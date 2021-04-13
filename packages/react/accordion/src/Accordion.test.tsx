import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import * as Accordion from './Accordion';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a single Accordion', () => {
  let handleValueChange: jest.Mock;
  let rendered: RenderResult;

  beforeEach(() => {
    handleValueChange = jest.fn();
    rendered = render(<AccordionTest type="single" onValueChange={handleValueChange} />);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when navigating by keyboard', () => {
    beforeEach(() => {
      const button = rendered.getByText('Button One');
      button.focus();
    });

    describe('on `ArrowDown`', () => {
      it('should move focus to the next button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
        expect(rendered.getByText('Button Two')).toHaveFocus();
      });
    });

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });

    describe('on `Home`', () => {
      it('should move focus to the first button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'Home' });
        expect(rendered.getByText('Button One')).toHaveFocus();
      });
    });

    describe('on `End`', () => {
      it('should move focus to the last button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'End' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });
  });

  describe('when clicking a button', () => {
    let button: HTMLElement;
    let panelOne: HTMLElement | null;

    beforeEach(() => {
      button = rendered.getByText('Button One');
      fireEvent.click(button);
      panelOne = rendered.getByText('Panel One');
    });

    it('should show the panel', () => {
      expect(panelOne).toBeVisible();
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should call onValueChange', () => {
      expect(handleValueChange).toHaveBeenCalledWith('One');
    });

    describe('then clicking the button again', () => {
      beforeEach(() => {
        fireEvent.click(button);
      });

      it('should close the panel', () => {
        expect(panelOne).not.toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith('');
      });
    });

    describe('then clicking another button', () => {
      beforeEach(() => {
        const button = rendered.getByText('Button Two');
        fireEvent.click(button);
      });

      it('should show the new panel', () => {
        const panelTwo = rendered.getByText('Panel Two');
        expect(panelTwo).toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith('Two');
      });

      it('should hide the previous panel', () => {
        expect(panelOne).not.toBeVisible();
      });
    });
  });
});

describe('given a multiple Accordion', () => {
  let handleValueChange: jest.Mock;
  let rendered: RenderResult;

  beforeEach(() => {
    handleValueChange = jest.fn();
    rendered = render(<AccordionTest type="multiple" onValueChange={handleValueChange} />);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when navigating by keyboard', () => {
    beforeEach(() => {
      rendered.getByText('Button One').focus();
    });

    describe('on `ArrowDown`', () => {
      it('should move focus to the next button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
        expect(rendered.getByText('Button Two')).toHaveFocus();
      });
    });

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });

    describe('on `Home`', () => {
      it('should move focus to the first button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'Home' });
        expect(rendered.getByText('Button One')).toHaveFocus();
      });
    });

    describe('on `End`', () => {
      it('should move focus to the last button', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'End' });
        expect(rendered.getByText('Button Three')).toHaveFocus();
      });
    });
  });

  describe('when clicking a button', () => {
    let button: HTMLElement;
    let panelOne: HTMLElement | null;

    beforeEach(() => {
      button = rendered.getByText('Button One');
      fireEvent.click(button);
      panelOne = rendered.getByText('Panel One');
    });

    it('should show the panel', () => {
      expect(panelOne).toBeVisible();
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should call onValueChange', () => {
      expect(handleValueChange).toHaveBeenCalledWith(['One']);
    });

    describe('then clicking the button again', () => {
      beforeEach(() => {
        fireEvent.click(button);
      });

      it('should hide the panel', () => {
        expect(panelOne).not.toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith([]);
      });
    });

    describe('then clicking another button', () => {
      beforeEach(() => {
        const button = rendered.getByText('Button Two');
        fireEvent.click(button);
      });

      it('should show the new panel', () => {
        const panelTwo = rendered.getByText('Panel Two');
        expect(panelTwo).toBeVisible();
      });

      it('should call onValueChange', () => {
        expect(handleValueChange).toHaveBeenCalledWith(['One', 'Two']);
      });

      it('should not hide the previous panel', () => {
        expect(panelOne).toBeVisible();
      });
    });
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
