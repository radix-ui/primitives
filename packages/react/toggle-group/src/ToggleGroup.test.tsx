import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as ToggleGroup from './ToggleGroup';
import { getSelector } from '@radix-ui/utils';

const ITEMS = ['One', 'Two', 'Three'];

describe('given a basic ToggleGroup', () => {
  let rendered: RenderResult;
  let item: HTMLElement;

  beforeEach(() => {
    rendered = render(<ToggleGroupTest />);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with a toggled button', async () => {
    item = rendered.getByText('Two');
    fireEvent.click(item);
    await waitFor(() => void rendered.getByText('Two'));
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have no toggled buttons by default', () => {
    for (const item of ITEMS) {
      expect(rendered.queryByText(item)?.getAttribute('data-state')).toBe('off');
    }
  });

  it('should have a radix attribute on the item', () => {
    item = rendered.getByTestId('item-one');
    const partDataAttr = `data-${getSelector('ToggleGroupItem')}`;
    expect(item).toHaveAttribute(partDataAttr);
  });

  describe('when clicking an item', () => {
    beforeEach(async () => {
      item = rendered.getByText('One');
      fireEvent.click(item);
      await waitFor(() => void rendered.getByText('One'));
    });

    it('should have a data-state attribute on the item set to `on`', () => {
      expect(item).toHaveAttribute('data-state', 'on');
    });

    describe('clicking another item', () => {
      beforeEach(async () => {
        item = rendered.getByText('Two');
        fireEvent.click(item);
        await waitFor(() => void rendered.getByText('Two'));
      });

      it('should have a data-state attribute on the item container set to `on`', () => {
        expect(item).toHaveAttribute('data-state', 'on');
      });

      it('should have a data-state attribute on the previous item container set to `off`', () => {
        const previousItem = rendered.getByText('One');
        expect(previousItem).toHaveAttribute('data-state', 'off');
      });

      describe('clicking the same item again', () => {
        beforeEach(async () => {
          item = rendered.getByText('Two');
          fireEvent.click(item);
          await waitFor(() => void rendered.getByText('Two'));
        });

        it('should have a data-state attribute on the item container set to `off`', () => {
          expect(item).toHaveAttribute('data-state', 'off');
        });
      });
    });
  });
});

describe('given a ToggleGroup with a change callback', () => {
  it('should call onValueChange', async () => {
    const handleValueChange = jest.fn();
    const rendered = render(<ToggleGroupTest onValueChange={handleValueChange} />);
    const item = rendered.getByText('Two');
    fireEvent.click(item);
    await waitFor(() => void rendered.getByText('Two'));
    expect(handleValueChange).toHaveBeenCalledTimes(1);
  });
});

describe('given a basic MultiSelectToggleGroup', () => {
  let rendered: RenderResult;
  let item: HTMLElement;

  beforeEach(() => {
    rendered = render(<MultiSelectToggleGroupTest />);
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with a toggled button', async () => {
    item = rendered.getByText('Two');
    fireEvent.click(item);
    await waitFor(() => void rendered.getByText('Two'));
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have no toggled buttons by default', () => {
    for (const item of ITEMS) {
      expect(rendered.queryByText(item)?.getAttribute('data-state')).toBe('off');
    }
  });

  it('should have a radix attribute on the item', () => {
    item = rendered.getByTestId('item-one');
    const partDataAttr = `data-${getSelector('MultiSelectToggleGroupItem')}`;
    expect(item).toHaveAttribute(partDataAttr);
  });

  describe('when clicking an item', () => {
    beforeEach(async () => {
      item = rendered.getByText('One');
      fireEvent.click(item);
      await waitFor(() => void rendered.getByText('One'));
    });

    it('should have a data-state attribute on the item set to `on`', () => {
      expect(item).toHaveAttribute('data-state', 'on');
    });

    describe('clicking another item', () => {
      beforeEach(async () => {
        item = rendered.getByText('Two');
        fireEvent.click(item);
        await waitFor(() => void rendered.getByText('Two'));
      });

      it('should have a data-state attribute on the item container set to `on`', () => {
        expect(item).toHaveAttribute('data-state', 'on');
      });

      it('should have a data-state attribute on the previous item container set to `on`', () => {
        const previousItem = rendered.getByText('One');
        expect(previousItem).toHaveAttribute('data-state', 'on');
      });

      describe('clicking the same item again', () => {
        beforeEach(async () => {
          item = rendered.getByText('Two');
          fireEvent.click(item);
          await waitFor(() => void rendered.getByText('Two'));
        });

        it('should have a data-state attribute on the item container set to `off`', () => {
          expect(item).toHaveAttribute('data-state', 'off');
        });
      });
    });
  });
});

function ToggleGroupTest(props: React.ComponentProps<typeof ToggleGroup.Root>) {
  return (
    <ToggleGroup.Root data-testid="container" {...props}>
      {ITEMS.map((val) => (
        <ToggleGroup.Item value={val} key={val} data-testid={`item-${val.toLowerCase()}`}>
          {val}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

function MultiSelectToggleGroupTest(
  props: React.ComponentProps<typeof ToggleGroup.MultiSelectRoot>
) {
  return (
    <ToggleGroup.MultiSelectRoot data-testid="container" {...props}>
      {ITEMS.map((val) => (
        <ToggleGroup.MultiSelectItem
          value={val}
          key={val}
          data-testid={`item-${val.toLowerCase()}`}
        >
          {val}
        </ToggleGroup.MultiSelectItem>
      ))}
    </ToggleGroup.MultiSelectRoot>
  );
}
