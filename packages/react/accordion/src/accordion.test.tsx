import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import * as Accordion from './accordion';
import type { Mock } from 'vitest';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a single Accordion', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;

  afterEach(cleanup);

  describe('with default orientation=vertical', () => {
    beforeEach(() => {
      handleValueChange = vi.fn();
      rendered = render(<AccordionTest type="single" onValueChange={handleValueChange} />);
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
          <AccordionTest type="single" orientation="horizontal" onValueChange={handleValueChange} />
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
          <AccordionTest
            type="single"
            dir="rtl"
            orientation="horizontal"
            onValueChange={handleValueChange}
          />
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
    rendered = render(<AccordionTest type="multiple" onValueChange={handleValueChange} />);
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

function AccordionTest(props: React.ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root data-testid="container" {...props}>
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
