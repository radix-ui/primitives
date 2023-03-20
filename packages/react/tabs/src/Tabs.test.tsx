import * as React from 'react';
import { axe } from 'jest-axe';
import { render, RenderResult, act, fireEvent } from '@testing-library/react';
import * as Tabs from '@radix-ui/react-tabs';

const ITEMS = ['First', 'Second', 'Third', 'Fourth'];
const SELECTION = 'Second';
const SELECTION_CLICKED = 'Third';

describe('given a Tab List', () => {
  describe('with default behaviour in an uncontrolled scenario', () => {
    let uncontrolledRendered: RenderResult;
    const getOptions = {
      hidden: true,
    };

    beforeEach(() => {
      uncontrolledRendered = render(<TabsTest defaultValue={SELECTION} />);
    });

    it('should have no accessibility violations in default state', async () => {
      expect(await axe(uncontrolledRendered.container)).toHaveNoViolations();
    });

    it('should check proper presence of all tablist entities', () => {
      const tablist = uncontrolledRendered.getAllByRole('tablist');
      const tabitems = uncontrolledRendered.getAllByRole('tab');
      const panels = uncontrolledRendered.getAllByRole('tabpanel', getOptions);

      expect(tablist).toHaveLength(1);
      expect(tabitems).toHaveLength(ITEMS.length);
      expect(panels).toHaveLength(ITEMS.length);
    });

    it('should show the proper tabpanel accordingly to click navigation', () => {
      const [, , tab3] = uncontrolledRendered.getAllByRole('tab');
      const [panel1, panel2, panel3, panel4] = uncontrolledRendered.getAllByRole(
        'tabpanel',
        getOptions
      );

      expect(panel1).toHaveAttribute('data-state', 'inactive');
      expect(panel2).toHaveAttribute('data-state', 'active');
      expect(panel3).toHaveAttribute('data-state', 'inactive');
      expect(panel4).toHaveAttribute('data-state', 'inactive');

      act(() => {
        fireEvent(
          tab3,
          new MouseEvent('mousedown', {
            bubbles: true,
          })
        );
      });

      expect(panel1).toHaveAttribute('data-state', 'inactive');
      expect(panel2).toHaveAttribute('data-state', 'inactive');
      expect(panel3).toHaveAttribute('data-state', 'active');
      expect(panel4).toHaveAttribute('data-state', 'inactive');
    });
  });

  describe('with default behaviour in a controlled scenario', () => {
    let controlledRendered: RenderResult;
    const controlledOnChange = jest.fn();
    const getOptions = {
      hidden: true,
    };

    beforeEach(() => {
      controlledRendered = render(
        <TabsTest value={SELECTION} onValueChange={controlledOnChange} />
      );
    });

    it('should have no accessibility violations in default state', async () => {
      expect(await axe(controlledRendered.container)).toHaveNoViolations();
    });

    it('should check proper presence of all tablist entities', () => {
      const tablist = controlledRendered.getAllByRole('tablist');
      const tabitems = controlledRendered.getAllByRole('tab');
      const panels = controlledRendered.getAllByRole('tabpanel', getOptions);

      expect(tablist).toHaveLength(1);
      expect(tabitems).toHaveLength(ITEMS.length);
      expect(panels).toHaveLength(ITEMS.length);
    });

    it('should show the proper tabpanel accordingly to click navigation', () => {
      const [panel1, panel2, panel3, panel4] = controlledRendered.getAllByRole(
        'tabpanel',
        getOptions
      );

      expect(panel1).toHaveAttribute('data-state', 'inactive');
      expect(panel2).toHaveAttribute('data-state', 'active');
      expect(panel3).toHaveAttribute('data-state', 'inactive');
      expect(panel4).toHaveAttribute('data-state', 'inactive');

      controlledRendered.rerender(
        <TabsTest value={SELECTION_CLICKED} onValueChange={controlledOnChange} />
      );

      expect(panel1).toHaveAttribute('data-state', 'inactive');
      expect(panel2).toHaveAttribute('data-state', 'inactive');
      expect(panel3).toHaveAttribute('data-state', 'active');
      expect(panel4).toHaveAttribute('data-state', 'inactive');
    });
  });
});

function TabsTest(rootProps: React.ComponentProps<typeof Tabs.Root>) {
  return (
    <Tabs.Root {...rootProps}>
      <Tabs.List aria-label="tabs example">
        {ITEMS.map((val, index) => (
          <Tabs.Trigger key={`${index}-t`} value={val}>{`${val} Tab`}</Tabs.Trigger>
        ))}
      </Tabs.List>
      {ITEMS.map((val, index) => (
        <Tabs.Content key={`${index}-c`} value={val}>{`${val} Content`}</Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
