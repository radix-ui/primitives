import { act, render } from '@testing-library/react';
import * as Select from '.';

const VALUE_1 = 'Value 1';
const VALUE_2 = 'Value 2';

function SelectTest(): React.ReactElement {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Open the select" />
        <Select.Portal>
          <Select.Content>
            <Select.Item value="value1">{VALUE_1}</Select.Item>
            <Select.Item value="value2">{VALUE_2}</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Trigger>
    </Select.Root>
  );
}

describe('Select', () => {
  describe('aria-controls', () => {
    it('should not be defined when the select is closed', async () => {
      const rendered = render(<SelectTest />);

      expect(rendered.queryByText(VALUE_1)).not.toBeInTheDocument();
      const trigger = rendered.getByRole('combobox');
      expect(trigger.getAttribute('aria-controls')).toBeNull();
    });

    it('should be valid when the select is open', () => {
      const rendered = render(<SelectTest />);

      const trigger = rendered.getByRole('combobox');
      act(() => trigger.click());
      expect(rendered.queryByText(VALUE_1)).toBeVisible();

      const ariaControls = trigger.getAttribute('aria-controls');
      expect(ariaControls).not.toBeNull();

      const listbox = rendered.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(listbox.id).toBe(ariaControls);
    });
  });
});
